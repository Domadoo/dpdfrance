<?php
/**
 * Copyright 2024 DPD France S.A.S.
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
 * @copyright 2024 DPD France S.A.S.
 * @license   http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
 */

namespace PrestaShop\Module\DPDFrance\ExternalContentProvider;

if (!defined('_PS_VERSION_')) {
    exit;
}

use DateTimeImmutable;

/**
 * Provider d'appel du webservice de Lead Time API
 *
 * C'est dans ce service que l'on gère le temps de transit entre deux codes postaux
 *
 * Il existe un environnement de test pour ce WS mais il n'est pas utilisé
 */
class LeadtimeProvider
{
    /**
     * @param string $url
     *
     * @param string $leadtimeKey
     *
     * @param array{
     *    'originCountry': string,
     *    'originPostalCode': string,
     *    'destinationCountry': string,
     *    'destinationPostalCode': string,
     *    'originBuCode': string,
     *    'soCode': string,
     * } $params
     *
     * @return DateTimeImmutable|null
     */
    public static function getDelayBetweenZipCodes(string $url, string $leadtimeKey, array $params)
    {
        $leadtimeCurl = curl_init();
        $leadtime = null;

        try {
            curl_setopt_array($leadtimeCurl, array(
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => json_encode($params),
                CURLOPT_HTTPHEADER => [
                    'apiKey: ' . $leadtimeKey,
                    'Content-Type: application/json',
                ],
            ));

            $leadtimeResponse = curl_exec($leadtimeCurl);

            // If curl_errno return 0 then we have no error
            if (curl_errno($leadtimeCurl) === 0) {
                $leadtimeResponse = json_decode($leadtimeResponse);
                if (!isset($leadtimeResponse->error) && isset($leadtimeResponse->leadTime)) {
                    $leadtime = (new DateTimeImmutable())->modify('+' . $leadtimeResponse->leadTime . ' day');
                }
            }
        } catch (\Exception $e) {
            //$errorMessage = $e->getMessage();
        }

        curl_close($leadtimeCurl);

        return $leadtime;
    }

    /**
     * Vérification de la configuration client et test de connexion, method : getDelayBetweenZipCodes
     * @param string $url
     *
     * @param string $leadtimeKey
     *
     * @return bool
     */
    public static function webserviceStatus(string $url, string $leadtimeKey)
    {
        $leadtimeCurl = curl_init();
        $state = false;
        $leadtimeParams = [
            '' => '',
        ];

        try {
            curl_setopt_array($leadtimeCurl, array(
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => json_encode($leadtimeParams),
                CURLOPT_HTTPHEADER => [
                    'apiKey: ' . $leadtimeKey,
                    'Content-Type: application/json',
                ],
            ));

            $leadtimeResponse = curl_exec($leadtimeCurl);

            // If curl_errno return 0 then we have no error
            if (curl_errno($leadtimeCurl) === 0) {
                $leadtimeResponse = json_decode($leadtimeResponse);
                if (isset($leadtimeResponse->message) && preg_match('/apiErrorList/', $leadtimeResponse->message)) {
                    $state = true;
                }
            }
        } catch (\Exception $e) {
            //$errorMessage = $e->getMessage();
        }

        curl_close($leadtimeCurl);

        return $state;
    }
}
