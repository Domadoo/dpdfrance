<?php
/**
 * Copyright 2023 DPD France S.A.S.
 *
 * This file is a part of dpdfrance module for Prestashop.
 *
 * NOTICE OF LICENSE
 *
 * This file is subject to the Academic Free License (AFL 3.0)
 * that is bundled with this package in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/afl-3.0.php
 *
 * DISCLAIMER
 *
 * Do not edit this file if you wish to upgrade this module to newer
 * versions in the future. If you wish to customize this module for
 * your needs please contact us at support.ecommerce@dpd.fr.
 *
 * @author    DPD France S.A.S. <support.ecommerce@dpd.fr>
 * @copyright 2023 DPD France S.A.S.
 * @license   http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
 */

namespace PrestaShop\Module\DPDFrance\ExternalContentProvider;

use PrestaShop\Module\DPDFrance\ExternalContentProvider\Transcription\Webtrace\clsTrace;
use PrestaShop\Module\DPDFrance\ExternalContentProvider\Transcription\Webtrace\ShipmentTrace;
use PrestaShop\Module\DPDFrance\ExternalContentProvider\Transcription\Webtrace\Traces;
use PrestaShop\Module\DPDFrance\ExternalContentProvider\Transcriptor\Transcriptor;
use SoapClient;
use SoapFault;
use SoapHeader;
use stdClass;

/**
 * Provider d'appel du webservice de suivi des colis (Webtrace)
 *
 * L'ancienne et la nouvelle versions de ce webservice cohabitent dans cette classe.
 * Nouvelle version du WS Webtrace utilisée : 4.5
 *
 * Informations complémentaires.
 * L'authentification à Webtrace se fait dans le header pour la nouvelle version alors qu'elle se fait dans le body dans
 * l'ancienne version.
 * Il n'existe pas d'environnement de test pour l'ancienne version du webservice. Il est donc primordial d'utiliser le
 * compte de test associé.
 */
class WebtraceProvider
{
    const WEBTRACE_URL_PROD = 'https://webtrace.dpd.fr/trace-service/Webtrace_Service.asmx?WSDL';
    const WEBTRACE_URL_TEST = 'https://e-station-testenv.cargonet.software/trace-service/Webtrace_Service.asmx?WSDL';
    const WEBTRACE_URL_PROD_OLD = 'http://webtrace.dpd.fr/dpd-webservices/webtrace_service.asmx?WSDL';

    /**
     * @var SoapClient|null
     */
    private static $soapClient = null;

    /**
     * @var stdClass{
     *    'userid': string,
     *    'password': string,
     * }|null
     */
    private static $auth;

    /**
     * Doit-on utiliser l'environnement de test ?
     *
     * @var bool|null
     */
    private static $useTestEnv;

    /**
     * Utilise-t-on l'ancien webservice de Webtrace ?
     *
     * @var bool|null
     */
    private static $isOld;

    /**
     * Initialise le Client SOAP pour Webtrace
     *
     * @param string $user
     * @param string $password En clair
     * @param bool $useTestEnv
     *
     * @return bool
     */
    public static function initSoapClient(string $user, string $password, bool $useTestEnv = false)
    {
        // On évite d'initialiser la classe si celle-ci l'a déjà été avec les mêmes paramètres.
        if (
            self::$soapClient instanceof SoapClient
            && self::$auth instanceof stdClass
            && self::$auth->userid === $user
            && self::$auth->password === $password
            && self::$useTestEnv === $useTestEnv
        ) {
            return true;
        }

        self::$useTestEnv = $useTestEnv;

        if ($user === '1064' && $useTestEnv === false) {
            // Ancienne version du WS
            self::$isOld = true;
            $url = self::WEBTRACE_URL_PROD_OLD;
        } else {
            // Nouvelle version du WS
            self::$isOld = false;
            $url = $useTestEnv === false ? self::WEBTRACE_URL_PROD : self::WEBTRACE_URL_TEST;
        }

        try {
            $soapClient = new SoapClient(
                $url,
                [
                    'connection_timeout' => 5,
                    'cache_wsdl'         => WSDL_CACHE_NONE,
                    'exceptions'         => true,
                ]
            );

            self::$auth = new stdClass();
            self::$auth->userid = $user;
            self::$auth->password = $password;

            // Dans la nouvelle version de Webtrace, l'authentification se fait dans le header de la requête SOAP
            $header = new SoapHeader('http://www.cargonet.software/', 'UserCredentials', self::$auth, false);

            $soapClient->__setSoapHeaders($header);
        } catch (SoapFault $exception) {
            return false;
        }

        self::$soapClient = $soapClient;

        return true;
    }

    /* Méthodes d'appel au webservice */

    /**
     * @param array{
     *    'Customer': array{
     *        'centernumber': int,
     *        'number': int,
     *        'countrycode': int,
     *    },
     *    'Language': string,
     *    'ShipmentNumber': string,
     *    'GetImages': bool,
     * } $params
     *
     * @return ShipmentTrace[]
     */
    public static function getShipmentTrace(array $params)
    {
        if (self::$isOld) {
            // On convertit les paramètres pour qu'ils correspondent à ceux de l'ancien WS
            $convertedParams = [
                'customer_center' => '3',
                'customer'        => self::$auth->userid,
                'password'        => self::$auth->password,
                'shipmentnumber'  => $params['ShipmentNumber'],
            ];

            $response = self::$soapClient->getShipmentTrace($convertedParams);

            $shipmentTracesStd = $response->getShipmentTraceResult;
        } else {
            $response = self::$soapClient->GetShipmentTrace([
                'request' => $params,
            ]);

            $shipmentTracesStd = $response->GetShipmentTraceResult->ShipmentTrace;
        }

        return self::transcriptShipmentTraceFromStd($shipmentTracesStd);
    }

    /**
     * Récupère une expédition par référence sur l'ancien ou le nouveau Webtrace
     *
     * @param array{
     *    'Customer': array{
     *        'centernumber': int,
     *        'number': int,
     *        'countrycode': int,
     *    },
     *    'Language': string,
     *    'Reference': string,
     *    'Searchmode': string,
     *    'GetImages': string,
     * } $params Format correspondant à la request attendu par le nouveau WS
     *
     * @return ShipmentTrace[] on adapte le retour de l'ancien Webtrace pour qu'il soit conforme au retour attendu par
     *                         le nouveau Webtrace
     */
    public static function getShipmentTraceByReference(array $params)
    {
        if (self::$isOld) {
            // On convertit les paramètres pour qu'ils correspondent à ceux de l'ancien WS
            $convertedParams = [
                'customer_center'          => '3',
                'customer'                 => self::$auth->userid,
                'password'                 => self::$auth->password,
                'reference'                => $params['Reference'],
                'shipping_customer_center' => $params['Customer']['centernumber'],
                'shipping_customer'        => $params['Customer']['number'],
                'searchmode'               => 'SearchMode_Equals',
                'language'                 => $params['Language'],
            ];

            $response = self::$soapClient->getShipmentTraceByReferenceGlobalWithCenterAsArray($convertedParams);

            // On convertit la réponse pour que son format corresponde à la réponse du nouveau WS
            $shipmentTracesStd = $response
                ->getShipmentTraceByReferenceGlobalWithCenterAsArrayResult
                ->clsShipmentTrace;
        } else {
            $response = self::$soapClient->GetShipmentTraceByReference([
                'request' => $params,
            ]);

            $shipmentTracesStd = $response
                ->GetShipmentTraceByReferenceResult
                ->ShipmentTrace;
        }

        return self::transcriptShipmentTraceFromStd($shipmentTracesStd);
    }

    /* Méthodes diverses */

    /**
     * Est-ce qu'on utilise l'ancien webservice ?
     *
     * @return bool|null
     */
    public static function isOld()
    {
        return self::$isOld;
    }

    /**
     * Retranscrit un stdClass[] en ShipmentTrace[]
     *
     * @param $shipmentTracesStd
     * @return ShipmentTrace[]
     */
    private static function transcriptShipmentTraceFromStd($shipmentTracesStd)
    {
        if (!is_array($shipmentTracesStd)) {
            $shipmentTracesStd = [$shipmentTracesStd];
        }

        $shipmentTraces = [];
        foreach ($shipmentTracesStd as $shipmentTraceStd) {
            $shipmentTraces[] = Transcriptor::convertTo(ShipmentTrace::class, $shipmentTraceStd, [
                'Traces'   => Traces::class,
                'clsTrace' => clsTrace::class, // Cas où la clé clsTrace pointerait directement sur un objet clsTrace
            ]);
        }

        /**
         * @var ShipmentTrace[] $shipmentTraces
         */
        foreach ($shipmentTraces as $shipmentTrace) {
            // Cas où la clé clsTrace pointerait sur une liste d'objets clsTrace
            if (!is_null($shipmentTrace->Traces) && is_array($shipmentTrace->Traces->clsTrace)) {
                foreach ($shipmentTrace->Traces->clsTrace as $key => $clsTraceStd) {
                    $shipmentTrace->Traces->clsTrace[$key] = Transcriptor::convertTo(clsTrace::class, $clsTraceStd);
                }
            }
        }

        return $shipmentTraces;
    }
}
