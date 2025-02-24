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

namespace PrestaShop\Module\DPDFrance\Util;

use Configuration;
use Exception;

/**
 * Classe intermédiaire entre la classe Configuration de Prestashop et le module pour renvoyer
 * des données correctement castées.
 */
class DPDConfig
{
    /**
     * Renvoie un paramètre de configuration DPDFRANCE_ casté comme il convient
     *
     * @param $key
     * @param $idLang
     * @param $idShopGroup
     * @param $idShop
     * @param $default
     * @return mixed
     */
    public static function get($key, $idLang = null, $idShopGroup = null, $idShop = null, $default = false)
    {
        switch ($key) {
            // Bool
            case 'DPDFRANCE_PARAM':
            case 'DPDFRANCE_MARKETPLACE_MODE':
            case 'DPDFRANCE_DAY_DEFINITE_MODE':
            case 'DPDFRANCE_AD_VALOREM':
                $value = (bool)Configuration::get($key, $idLang, $idShopGroup, $idShop, $default);
                break;
            // Int
            case 'DPDFRANCE_AUTO_UPDATE':
            case 'DPDFRANCE_CLASSIC_CARRIER_ID':
            case 'DPDFRANCE_RELAIS_CARRIER_ID':
            case 'DPDFRANCE_PREDICT_CARRIER_ID':
            case 'DPDFRANCE_ETAPE_EXPEDIEE':
            case 'DPDFRANCE_ETAPE_EXPEDITION':
            case 'DPDFRANCE_ETAPE_LIVRE':
            case 'DPDFRANCE_RETOUR_OPTION':
            case 'DPDFRANCE_LAST_TRACKING':
            case 'DPDFRANCE_PREDICT_DEPOT_CODE':
            case 'DPDFRANCE_PREDICT_SHIPPER_CODE':
            case 'DPDFRANCE_RELAIS_DEPOT_CODE':
            case 'DPDFRANCE_RELAIS_SHIPPER_CODE':
            case 'DPDFRANCE_CLASSIC_DEPOT_CODE':
            case 'DPDFRANCE_CLASSIC_SHIPPER_CODE':
                $value = (int)Configuration::get($key, $idLang, $idShopGroup, $idShop, $default);
                break;
            // Float
            case 'DPDFRANCE_SUPP_ILES':
            case 'DPDFRANCE_SUPP_MONTAGNE':
                $value = (float)Configuration::get($key, $idLang, $idShopGroup, $idShop, $default);
                break;
            // Valeurs encryptées
            case 'DPDFRANCE_API_LOGIN':
            case 'DPDFRANCE_API_PASSWORD':
            case 'DPDFRANCE_WEBTRACE_LOGIN':
            case 'DPDFRANCE_WEBTRACE_PASSWORD':
            case 'DPDFRANCE_GOOGLE_API_KEY':
            case 'DPDFRANCE_LEADTIME_API_KEY':
                $rawValue = DPDTools::decrypt(Configuration::get($key, $idLang, $idShopGroup, $idShop, $default));
                $value = $rawValue === false ? '' : $rawValue;
                break;
            // Tableaux sérializés au format |int1|int2|int3 avec des int et dont on supprime la première valeur nulle si existante (historique)
            case 'DPDFRANCE_PREDICT_CARRIER_LOG':
            case 'DPDFRANCE_RELAIS_CARRIER_LOG':
            case 'DPDFRANCE_CLASSIC_CARRIER_LOG':
                $value = array_map(
                    'intval',
                    explode('|', ltrim(Configuration::get($key, $idLang, $idShopGroup, $idShop, $default), '|'))
                );
                break;
            // String (par défaut)
            case 'DPDFRANCE_SERVICE_TYPE':
            case 'DPDFRANCE_PRINTER_CONNECT':
            case 'DPDFRANCE_PRINTER_PORT':
            case 'DPDFRANCE_PRINTER_IP':
            case 'DPDFRANCE_HIDE_NETWORK':
            case 'DPDFRANCE_PRINTER_SERIAL':
            case 'DPDFRANCE_FORMAT_MOD':
            case 'DPDFRANCE_FORMAT_PRINT':
            case 'DPDFRANCE_RELAIS_MYPUDO_URL':
            default:
                $value = Configuration::get($key, $idLang, $idShopGroup, $idShop, $default);
        }

        Hook::exec('actionGetDPDConfigAfter', [
            'key' => $key,
            'value' => &$value,
            'idLang' => $idLang,
            'idShopGroup' => $idShopGroup,
            'idShop' => $idShop,
            'default' => $default,
        ]);

        return $value;
    }

    /**
     * Mettre à jour un paramètre de configuration DPDFRANCE_ casté comme il convient
     * Attention, on ne prend pas en compte les (array)$values liées au multilingue contrairement à la fonction
     * Configuration::updateValue(). Ici un (array)$value sera transformé en (string).
     *
     * @param $key
     * @param $value
     * @param $html
     * @param $idShopGroup
     * @param $idShop
     * @return bool
     * @throws Exception
     */
    public static function updateValue($key, $value, $html = false, $idShopGroup = null, $idShop = null)
    {
        // Aucune variable DPDFRANCE_ n'a intérêt à avoir des caractères vides autour d'elle.
        $value = trim($value);

        switch ($key) {
            // Bool (que l'on convertit en 0 ou 1)
            case 'DPDFRANCE_PARAM':
            case 'DPDFRANCE_MARKETPLACE_MODE':
            case 'DPDFRANCE_DAY_DEFINITE_MODE':
            case 'DPDFRANCE_AD_VALOREM':
            // Int
            case 'DPDFRANCE_AUTO_UPDATE':
            case 'DPDFRANCE_ETAPE_EXPEDITION':
            case 'DPDFRANCE_ETAPE_EXPEDIEE':
            case 'DPDFRANCE_ETAPE_LIVRE':
            case 'DPDFRANCE_RETOUR_OPTION':
            case 'DPDFRANCE_LAST_TRACKING':
            case 'DPDFRANCE_PREDICT_DEPOT_CODE':
            case 'DPDFRANCE_RELAIS_DEPOT_CODE':
            case 'DPDFRANCE_CLASSIC_DEPOT_CODE':
            case 'DPDFRANCE_PREDICT_SHIPPER_CODE':
            case 'DPDFRANCE_RELAIS_SHIPPER_CODE':
            case 'DPDFRANCE_CLASSIC_SHIPPER_CODE':
                $valueToUpdate = (int)$value;
                break;
            // Float
            case 'DPDFRANCE_SUPP_ILES':
            case 'DPDFRANCE_SUPP_MONTAGNE':
                $valueToUpdate = (float)str_replace(',', '.', $value);
                break;
            // Valeurs encryptées
            case 'DPDFRANCE_API_LOGIN':
            case 'DPDFRANCE_API_PASSWORD':
            case 'DPDFRANCE_WEBTRACE_LOGIN':
            case 'DPDFRANCE_WEBTRACE_PASSWORD':
            case 'DPDFRANCE_GOOGLE_API_KEY':
            case 'DPDFRANCE_LEADTIME_API_KEY':
                $valueToUpdate = !empty($value) ? DPDTools::encrypt($value) : '';
                break;
            // Id Carrier
            case 'DPDFRANCE_PREDICT_CARRIER_ID':
            case 'DPDFRANCE_RELAIS_CARRIER_ID':
            case 'DPDFRANCE_CLASSIC_CARRIER_ID':
                $valueToUpdate = (int)$value;
                // Cas particulier : on gère l'update du LOG lié au carrier en direct
                $logKey = substr($key, 0, -2) . 'LOG';
                $logValue = explode('|', Configuration::get($logKey));
                // On update le LOG, en évitant les doublons et l'insertion d'id 0.
                if (!in_array($valueToUpdate, $logValue) && $valueToUpdate !== 0) {
                    $logValue[] = $valueToUpdate;
                    Configuration::updateValue($logKey, implode('|', $logValue), $html, $idShopGroup, $idShop);
                }
                break;
            // Autres champs, pour info
            case 'DPDFRANCE_SERVICE_TYPE':
            case 'DPDFRANCE_PRINTER_CONNECT':
            case 'DPDFRANCE_PRINTER_PORT':
            case 'DPDFRANCE_PRINTER_IP':
            case 'DPDFRANCE_HIDE_NETWORK':
            case 'DPDFRANCE_PRINTER_SERIAL':
            case 'DPDFRANCE_FORMAT_MOD':
            case 'DPDFRANCE_FORMAT_PRINT':
            case 'DPDFRANCE_RELAIS_MYPUDO_URL':
            default:
                $valueToUpdate = $value;
        }

        // On reconvertit la valeur en string pour coller à la table ps_configuration
        return Configuration::updateValue($key, (string)$valueToUpdate, $html, $idShopGroup, $idShop);
    }

    /**
     * Récupère les infos du service de livraison liées au service concerné (Relais, Predict, Classic)
     *  - depot_code: n° agence
     *  - shipper_code: n° de contrat
     *
     * @param string $service
     * @param int $idShop
     * @return array{
     *     'depot_code': int|null,
     *     'shipper_code': int|null,
     * }
     */
    public static function getServiceLivraisonInfos(string $service, int $idShop): array
    {
        switch ($service) {
            case 'HDP_PRE':
            case 'PRE':
                $infos = [
                    'depot_code'   => self::get('DPDFRANCE_PREDICT_DEPOT_CODE', null, null, $idShop),
                    'shipper_code' => self::get('DPDFRANCE_PREDICT_SHIPPER_CODE', null, null, $idShop),
                ];
                break;
            case 'REL':
                $infos = [
                    'depot_code'   => self::get('DPDFRANCE_RELAIS_DEPOT_CODE', null, null, $idShop),
                    'shipper_code' => self::get('DPDFRANCE_RELAIS_SHIPPER_CODE', null, null, $idShop),
                ];
                break;
            case 'HDP_CLA':
            case 'CLA':
                $infos = [
                    'depot_code'   => self::get('DPDFRANCE_CLASSIC_DEPOT_CODE', null, null, $idShop),
                    'shipper_code' => self::get('DPDFRANCE_CLASSIC_SHIPPER_CODE', null, null, $idShop),
                ];
                break;
            default:
                $infos = [
                    'depot_code'   => null,
                    'shipper_code' => null,
                ];
        }

        return $infos;
    }

    /**
     * Le module dpdfrance est-il activé ?
     *
     * @return bool
     */
    public static function isModuleEnabled()
    {
        return self::get('DPDFRANCE_PARAM');
    }
}
