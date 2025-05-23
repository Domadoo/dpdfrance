/**
 * Copyright 2025 DPD France S.A.S.
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
 * @copyright 2025 DPD France S.A.S.
 * @license   http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
 */

/**
 * ------------------------------------------------RELAIS---------------------------------------------------------------
 */

/**
 * Google Maps
 */
const initializeDpdFranceGM = (mapid, lat, longti, baseurl) => {
    let latlng = new google.maps.LatLng(lat, longti);
    let myOptions = {
        zoom: 16,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
            {
                "featureType": "landscape",
                "stylers": [{"visibility": "on"}, {"color": "#e6e7e7"}]
            }, {
                "featureType": "poi.sports_complex",
                "stylers": [{"visibility": "on"}]
            }, {
                "featureType": "poi.attraction",
                "stylers": [{"visibility": "off"}]
            }, {
                "featureType": "poi.government",
                "stylers": [{"visibility": "on"}]
            }, {
                "featureType": "poi.medical",
                "stylers": [{"visibility": "on"}]
            }, {
                "featureType": "poi.place_of_worship",
                "stylers": [{"visibility": "on"}]
            }, {
                "featureType": "poi.school",
                "stylers": [{"visibility": "on"}]
            }, {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{"visibility": "on"}, {"color": "#d2e4f3"}]
            }, {
                "featureType": "water",
                "elementType": "labels",
                "stylers": [{"visibility": "on"}]
            }, {
                "featureType": "transit",
                "elementType": "labels",
                "stylers": [{"visibility": "off"}]
            }, {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [{"visibility": "on"}, {"color": "#ffffff"}]
            }, {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [{"visibility": "on"}, {"color": "#e6e7e7"}]
            }, {
                "elementType": "labels.text.fill",
                "stylers": [{"visibility": "on"}, {"color": "#666666"}]
            }, {
                "featureType": "poi.business",
                "stylers": [{"visibility": "off"}]
            }, {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [{"visibility": "off"}]
            }, {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [{"visibility": "on"}, {"color": "#dbdbdb"}]
            }, {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [{"visibility": "on"}, {"color": "#808285"}]
            }, {
                "featureType": "transit.station",
                "stylers": [{"visibility": "on"}]
            }, {
                "featureType": "transit",
                "elementType": "geometry",
                "stylers": [{"visibility": "on"}, {"color": "#dbdbdb"}]
            }, {
                "elementType": "labels.icon",
                "stylers": [{"visibility": "on"}, {"saturation": -100}]
            }, {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [{"visibility": "off"}]
            }, {
                "elementType": "labels.text",
                "stylers": [{"visibility": "on"}]
            }, {
                "featureType": "transit.line",
                "elementType": "labels.text",
                "stylers": [{"visibility": "off"}]
            }
        ]
    };

    let map = new google.maps.Map(document.getElementById(mapid), myOptions);
    let marker = new google.maps.Marker(
        {
            icon: baseurl + "/views/img/front/relais/logo-max-png.png",
            position: latlng,
            animation: google.maps.Animation.DROP,
            map: map
        }
    );
};

/**
 * Open a modal with the Pickup relay information and display the map with the marker
 */
const openDpdFranceDialog = (id, mapid, lat, longti, baseurl) => {
    $("#header").css('z-index', 0);
    let greyFilterPage = $("#dpdfrance_relais_filter");
    let relayDetailsSelected = $("#" + id);

    greyFilterPage.fadeIn(150, () => relayDetailsSelected.fadeIn(150));

    window.setTimeout(() => {
        initializeDpdFranceGM(mapid, lat, longti, baseurl)
    }, 200);
};

/**
 * Update Relais DPD Pick Up Points
 */
const dpdFranceRelaisAjaxUpdate = (address, zipcode, city, action, dpdfrance_cart_id) => {
    if ((zipcode && action === 'search') || action === 'reset') {
        let img = '<img id="dpdfrance_reset_submit_loader" src="' + dpdfrance_img_base_dir + '/views/img/front/relais/loader.gif" alt="loader"/>';
        $('#dpdfrance_reset_submit').after(img);
        $.ajax(dpdfrance_base_dir + '?action_ajax_dpdfrance=ajaxUpdatePoints',
            {
                type: 'POST',
                data: {
                    'address': address,
                    'zipcode': zipcode,
                    'city': city,
                    'action': action,
                    'dpdfrance_cart_id': dpdfrance_cart_id
                },
                success: function (data) {
                    let html = $(data);
                    let relaisPickUpPointTable = $('#dpdfrance_relais_point_table');
                    relaisPickUpPointTable.html(html);
                    relaisPickUpPointTable.children('#dpdfrance_relais_point_table').show();
                    // * Vérifies si un point relais est choisi et l'enregistre
                    dpdFranceCheckPudo();
                }
            }
        );
    } else {
        $('#dpdfrance_search_zipcode').css('border', '1px solid #dc0032');
    }
};

/**
 * Hide the grey filter of the whole checkout page and hide the relais details modals
 */
const hideGreyFilterAndDpdRelaisDetails = () => {
    for (let index = 1; index < 6; i++) {
        document.getElementById('dpdfrance_relais_filter').style.display = 'none';
        document.getElementById('dpdfrance_relaydetail' + index).style.display = 'none';
    }
}

/**
 * Handle the FO error messages for the relay block
 */
const dpdFranceHandlePudoErrorBlock = ajaxRegisterPudoResponse => {
    /**
     * Check if DPD relay delivery blocks are hidden and therefore not used
     */
    let errorBlockDisplay = $("table#dpdfrance_relais_point_table").css('display');
    if (errorBlockDisplay !== 'none') {
        /**
         * Check if DPD relay block error message is displayed. If displayed hide it
         */
        let errorBlock = document.querySelector('#dpdfrance_relais_error_message');
        if (errorBlock) {
            document.getElementById("dpdfrance_relais_error_message").parentElement.remove();
        }

        dpdFranceHandleOrderButtonStatus(false);

        if (ajaxRegisterPudoResponse === true) {
            dpdFranceHandleOrderButtonStatus(true);
        } else if (ajaxRegisterPudoResponse !== false) {
            /**
             * Display the DPD relay blocks error message
             */
            $('<tr>', {
                html: $('<td id="dpdfrance_relais_error_message">').attr('colspan', 3)
            }).prependTo($('#dpdfrance_relais_point_table > tbody').first());

            $('<div>', {
                class: 'dpdfrance_relais_error',
                text: ajaxRegisterPudoResponse
            }).appendTo($('#dpdfrance_relais_error_message'));
        }
    }
};

/**
 * Call AJAX to push Pudo selection, <br/>
 * on success, enable Continue button, handle the error messages <br/>
 * on error, disable Continue button, put an error log <br/>
 */
const dpdFranceRegisterPudo = (pudoId, origin) => {
    //Handle the FO checkout process
    let checkoutStep = $('#checkout-delivery-step').hasClass('-current');
    if (checkoutStep || origin) {
        if (!pudoId) {
            dpdFranceHandleOrderButtonStatus(false);
            console.error("Nous avons rencontré une problématique temporaire dans l'enregistrement de votre DPD Pickup. Merci de sélectionner un autre Relais Pickup");
            return false;
        }

        $.ajax(dpdfrance_base_dir + '?action_ajax_dpdfrance=ajaxRegisterPudo', {
            type: 'POST',
            async: false,
            data: {
                'dpdfrance_cart_id': dpdfrance_cart_id,
                'pudo_id': pudoId,
                'id_carrier': parseInt(document.querySelector('input[id*="delivery_option_"]:checked').value),
            },
            dataType: 'json',
            error: function () {
                dpdFranceHandleOrderButtonStatus(false);
                console.error("Nous avons rencontré une problématique temporaire dans l'enregistrement de votre DPD Pickup. Merci de sélectionner un autre Relais Pickup");
            },
            success: function (data) {
                dpdFranceHandlePudoErrorBlock(data);
            }
        });
    }
};

/**
 * Check Pudo selection
 */
const dpdFranceCheckPudo = origin => {
    let selectedPUDO = document.querySelector("[name=dpdfrance_relay_id]:checked");
    let error = document.querySelector(".dpdfrance_relais_error");
    if (selectedPUDO && error === null) {
        if (origin) {
            dpdFranceRegisterPudo(selectedPUDO.value, origin);
        } else {
            dpdFranceRegisterPudo(selectedPUDO.value);
        }
    } else {
        dpdFranceHandleOrderButtonStatus(false);
        return false;
    }
};

/**
 * Display the Relais block under the description and check if a pickup point is selected then register it
 */
const displayRelayBlock = () => {
    let tableListPickUpPointsRelay = $('table#dpdfrance_relais_point_table.dpdfrance_fo');
    let relayDescriptionPart = $("[id^=delivery_option]:checked").parents('.delivery-option').children('label');

    // * Déplace la liste de points relais sous la description
    tableListPickUpPointsRelay.appendTo(relayDescriptionPart);

    // * Cache les blocs de livraison DPD (Predict / Relais)
    hideDPDRelaisAndPredictBlock();

    // * Affiche la liste des points relais
    tableListPickUpPointsRelay.fadeIn('fast');

    // * Vérifies si un point relais est choisi et l'enregistre
    dpdFranceCheckPudo();
}

/**
 * ------------------------------------------------PREDICT--------------------------------------------------------------
 */

/**
 * Call AJAX to push GSM number
 */
const dpdfrance_registerGsm = phone => {
    if (phone) {
        $.ajax(dpdfrance_base_dir + '?action_ajax_dpdfrance=ajaxRegisterGsm',
            {
                type: 'POST',
                data: {
                    'dpdfrance_cart_id': dpdfrance_cart_id,
                    'gsm_dest': phone,
                    'id_carrier': parseInt(document.querySelector('input[id*="delivery_option_"]:checked').value),
                },
                dataType: 'json',
                error: function () {
                    dpdFranceHandleOrderButtonStatus(false);
                    console.error('Votre numéro de téléphone n\'a pas été sauvegardé, merci de réessayer.');
                }
            }
        );
        dpdFranceHandleOrderButtonStatus(true);
    } else {
        dpdFranceHandleOrderButtonStatus(false);
        $('#input_dpdfrance_predict_gsm_dest').css('border', '2px solid red');
    }
};

/**
 * Check European GSM validity
 */
const dpdfrance_checkGSM = (gsm) => {
    let gsmDest = document.getElementById('input_dpdfrance_predict_gsm_dest');
    if (!gsmDest) return false;
    if (gsm && gsm !== gsmDest) {
        gsmDest.value = gsm;
    }
    let gsm_austria = new RegExp(/^(\+|00)43(\s?\d{9,10})$/);
    let gsm_belgium = new RegExp(/^(\+|00)32(\s?\d{8,9})$/);
    let gsm_croatia = new RegExp(/^(\+|00)385(\s?\d{8,9})$/);
    let gsm_czech = new RegExp(/^(\+|00)420(\s?\d{9,10})$/);
    let gsm_denmark = new RegExp(/^(\+|00)45(\s?\d{8,9})$/);
    let gsm_estonia = new RegExp(/^(\+|00)372(\s?\d{7,8})$/);
    let gsm_finland = new RegExp(/^(\+|00)358(\s?\d{5,12})$/);
    let gsm_france = new RegExp(/^((\+33|0033|0)[67])(?:[ _.-]?(\d{2})){4}$/);
    let gsm_germany = new RegExp(/^(\+|00)49(\s?\d{10,11})$/);
    let gsm_hungary = new RegExp(/^(\+|00)36(\s?\d{8,9})$/);
    let gsm_ireland = new RegExp(/^(\+|00)353(\s?\d{8,9})$/);
    let gsm_italy = new RegExp(/^(\+|00)39(\s?\d{8,11})$/);
    let gsm_latvia = new RegExp(/^(\+|00)371(\s?\d{8,9})$/);
    let gsm_lithuania = new RegExp(/^(\+|00)370(\s?\d{8,9})$/);
    let gsm_luxembourg = new RegExp(/^(\+|00)352(\s?\d{8,9})$/);
    let gsm_netherlands = new RegExp(/^(\+|00)31(\s?\d{9,10})$/);
    let gsm_poland = new RegExp(/^(\+|00)48(\s?\d{9,10})$/);
    let gsm_portugal = new RegExp(/^(\+|00)351(\s?\d{9,10})$/);
    let gsm_slovakia = new RegExp(/^(\+|00)421(\s?\d{9,10})$/);
    let gsm_slovenia = new RegExp(/^(\+|00)386(\s?\d{8,9})$/);
    let gsm_spain = new RegExp(/^(\+|00)34(\s?\d{9,10})$/);
    let gsm_switzerland = new RegExp(/^(\+|00)41(\s?\d{9,10})$/);
    let gsm_sweden = new RegExp(/^(\+|00)46(\s?\d{6,9})$/);
    let gsm_uk = new RegExp(/^(\+|00)447([3456789]\d)(\s?\d{7})$/);
    let numbers = gsmDest.value.substr(-6);
    let pattern = [
        '000000', '111111', '222222', '333333', '444444',
        '555555', '666666', '777777', '888888', '999999',
        '123456', '234567', '345678', '456789'
    ];
    let predict_gsm_button = $("#dpdfrance_predict_gsm_button");
    let predict_error = $("#dpdfrance_predict_error");
    if (
        (
            gsm_austria.test(gsmDest.value) ||
            gsm_belgium.test(gsmDest.value) ||
            gsm_croatia.test(gsmDest.value) ||
            gsm_czech.test(gsmDest.value) ||
            gsm_denmark.test(gsmDest.value) ||
            gsm_estonia.test(gsmDest.value) ||
            gsm_finland.test(gsmDest.value) ||
            gsm_france.test(gsmDest.value) ||
            gsm_germany.test(gsmDest.value) ||
            gsm_hungary.test(gsmDest.value) ||
            gsm_ireland.test(gsmDest.value) ||
            gsm_italy.test(gsmDest.value) ||
            gsm_latvia.test(gsmDest.value) ||
            gsm_lithuania.test(gsmDest.value) ||
            gsm_luxembourg.test(gsmDest.value) ||
            gsm_netherlands.test(gsmDest.value) ||
            gsm_poland.test(gsmDest.value) ||
            gsm_portugal.test(gsmDest.value) ||
            gsm_slovakia.test(gsmDest.value) ||
            gsm_slovenia.test(gsmDest.value) ||
            gsm_spain.test(gsmDest.value) ||
            gsm_switzerland.test(gsmDest.value) ||
            gsm_sweden.test(gsmDest.value) ||
            gsm_uk.test(gsmDest.value)
        ) && !pattern.includes(numbers)
    ) {
        // GSM OK
        predict_gsm_button.css('background-color', '#34a900');
        predict_gsm_button.html('&#10003');
        predict_error.hide();
        dpdfrance_registerGsm(gsmDest.value);
        dpdFranceHandleOrderButtonStatus(true);
        return true;
    } else {
        // GSM NOK
        predict_gsm_button.css('background-color', '#424143');
        predict_gsm_button.html('>');
        predict_error.show();
        dpdFranceHandleOrderButtonStatus(false);
        return false;
    }
};

/**
 * Display the Predict block under the description and check if the format of the phone is correct then register it
 */
const displayPredictBlock = () => {
    let predictBlock = $("#div_dpdfrance_predict_block");
    let predictDescriptionPart = $("[id^=delivery_option]:checked").parents('.delivery-option').children('label');

    // * Déplace le bloc predict sous la description
    predictBlock.appendTo(predictDescriptionPart);

    // * Cache les blocs de livraison DPD (Predict / Relais)
    hideDPDRelaisAndPredictBlock();

    // * Affiche la liste des points relais
    predictBlock.fadeIn('fast');

    // * Vérifie le format du numero de telephone et l'enregistre
    dpdfrance_checkGSM();
}

/**
 * ------------------------------------------------UTILS-----------------------------------------------------------------
 */

/**
 * Block/Unblock Order/Continue button
 */
const dpdFranceHandleOrderButtonStatus = status => {
    document.querySelector('[name=confirmDeliveryOption]').disabled = !status;
};

/**
 *  Uncheck All Delivery Options
 */
const uncheckAllDeliveryOptions = () => {
    document.querySelectorAll("input[name*='delivery_option[']").forEach(function (element) {
        element.removeAttribute("checked");
    });
}

/**
 *  Hide DPD France Relay and Predict Block
 */
const hideDPDRelaisAndPredictBlock = () => {
    $(".dpdfrance_fo").hide();
}

/**
 *  Handle display block of DPD delivery option in the checkout page
 */
const dpdFranceDisplayMethodBlock = () => {
    let selectedShippingMethod = $("input[name*='delivery_option[']:checked");
    if (selectedShippingMethod.length === 0) {
        console.warn("Je n'ai pas encore de methode de livraison sélectionné");
        return;
    }
    let selectedShippingMethodValue = selectedShippingMethod.val().slice(0, -1);

    if (selectedShippingMethodValue === dpdfranceRelaisCarrierId) {
        displayRelayBlock();
    } else if (selectedShippingMethodValue === dpdfrancePredictCarrierId) {
        displayPredictBlock();
    } else {
        // * Cache les blocs de livraison DPD (Predict / Relais)
        hideDPDRelaisAndPredictBlock();

        // * Pour les transporteurs autres que Relais et Predict, supprime l'entrée correspondante dans la table dpdfrance_shipping
        dpdfranceUpdateShipping();

        // * Active le bouton "Continuer"
        dpdFranceHandleOrderButtonStatus(true);
    }
};

/**
 * Get Mobile Phone number from the selected delivery address
 */
const dpdfranceGetGsmFromSelectedAddress = (addressId) => {
    let gsm = '';
    $.ajax(dpdfrance_base_dir + '?action_ajax_dpdfrance=ajaxGetGsmFromSelectedAddress',
        {
            type: 'POST',
            async: false,
            data: {
                'address_id': addressId
            },
            success: function (text) {
                gsm = text;
            },
            error: function () {
                dpdFranceHandleOrderButtonStatus(false);
                gsm = false;
                console.log('Un problème est survenue, merci de réessayer.');
            }
        }
    );
    return gsm;
}

/**
 * Delete previous dpdfrance_shipping entry in database
 */
const dpdfranceUpdateShipping = () => {
    $.ajax(dpdfrance_base_dir,
        {
            type: 'POST',
            data: {
                'action_ajax_dpdfrance': 'ajaxUpdateShipping'
            },
            dataType: 'json',
            success: function () {
                return true;
            },
            error: function () {
                dpdFranceHandleOrderButtonStatus(false);
                console.log('Un problème est survenue, merci de réessayer.');
                return false;
            }
        }
    );
}

/**
 *  Handle display block of lead time delivery option in the checkout page
 */
const dpdFranceDisplayLeadtime = () => {
    let selectedAddressId = $("article.address-item.selected").find('input[name=id_address_delivery]').val();
    let response = '';

    $.ajax(dpdfrance_base_dir + '?action_ajax_dpdfrance=ajaxGetLeadtime',
        {
            type: 'POST',
            async: false,
            data: {
                'address_id': selectedAddressId,
                'carrier_id': parseInt(document.querySelector('input[id*="delivery_option_"]:checked').value)
            },
            success: function (e) {
                response = e;
            },
            error: function () {
                return false;
            }
        }
    );

    //Handle the first time the X is displayed. At this time the template cannot verify the carrier id.
    if (!document.querySelector('#dpdfrance_checkout_block') && response) {
        let checkoutSummaryDate = document.createTextNode($.parseJSON(response).date);
        let blocCheckoutSummaryDiv = document.createElement("div");
        let blocCheckoutSummarySpan = document.createElement("span");
        blocCheckoutSummarySpan.className = "dpdfrance_day_definite_checkout";
        blocCheckoutSummaryDiv.className = "cart-summary-line";
        blocCheckoutSummarySpan.appendChild(checkoutSummaryDate);
        blocCheckoutSummaryDiv.appendChild(blocCheckoutSummarySpan);
        $("#js-checkout-summary div.card-block:nth-child(1)").prepend(blocCheckoutSummaryDiv);
    }

    if (response) {
        let dayDefiniteData = $.parseJSON(response);

        //Create and insert the summary date
        let finalSummaryDate = document.createTextNode(dayDefiniteData.date);
        let blocFinalSummaryTr = document.createElement("tr");
        let blocFinalSummaryTd = document.createElement("td");
        blocFinalSummaryTd.className = "dpdfrance_day_definite_summary";
        blocFinalSummaryTd.appendChild(finalSummaryDate);
        blocFinalSummaryTr.appendChild(blocFinalSummaryTd);
        $(".order-confirmation-table .total-value").before(blocFinalSummaryTr);

        //Create and insert the day definite information block
        let blocDayDefinite = document.createElement("div");
        let dayDefiniteText = document.createTextNode(dayDefiniteData.text);
        blocDayDefinite.className = "dpdfrance_day_definite_info";
        blocDayDefinite.appendChild(dayDefiniteText);
        $(".order-confirmation-table").after(blocDayDefinite);
    }
};

/**
 * ------------------------------------------------MAIN-----------------------------------------------------------------
 */

/**
 * When the DOM is ready
 */
document.addEventListener("DOMContentLoaded", () => {
    /**
     * Display dpd france delivery options
     */
    dpdFranceDisplayMethodBlock();

    /**
     * Display dpd france leadtime delivery option only when a carrier is selected
     */
    let carrierIsSelected = $("input[name*='delivery_option[']:checked");
    if (carrierIsSelected.length !== 0) {
        dpdFranceDisplayLeadtime();
    }

    /**
     * Handle relay points behavior on click and register relau points delivery address
     */
    $('#dpdfrance_relais_point_table').on('click', 'tr.dpdfrance_lignepr', function (event) {
        dpdFranceRegisterPudo($(this).data("relayId"));
        event.preventDefault();
    });

    /**
     * Handle relay points behavior on click (checkout payment step) and register default relau points delivery address
     */
    document.querySelector('#checkout-delivery-step').addEventListener('click', () => {
        if ($('#checkout-payment-step').hasClass('-current')) {
            dpdFranceCheckPudo('paymentReturn');
        }
    });

    /**
     * [ALL DELIVERY OPTIONS] EVENT LISTENER
     * If the delivery option has changed
     */
    document.querySelectorAll("input[name*='delivery_option[']").forEach(function (element) {
        element.addEventListener("change", function () {
            uncheckAllDeliveryOptions();
            element.setAttribute('checked', 'checked');
            dpdFranceDisplayMethodBlock();
        });
    });

    /**
     * PREDICT
     */
    let predictBlock = document.querySelector('#div_dpdfrance_predict_block');
    //Check if the current checkout step in the FO is valid
    let checkoutStepValid = $('#checkout-delivery-step').hasClass('-current');
    if (predictBlock && checkoutStepValid) {
        /**
         * Validate the format of the phone number, if empty return empty value else display number and error message
         */
        let gsmNumbersFormatValidation = new RegExp(/^[\+]?[(]?[0-9]{0,3}[)]?[-\s\.]?[0-9]{0,3}[-\s\.]?[0-9]+$/, 'im');
        let gsmBasicFormatValidation = new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,8}$/, 'im');
        let selectedAddressId = $("article.address-item.selected").find('input[name=id_address_delivery]').val();
        let predictGsmButton = $("#dpdfrance_predict_gsm_button");
        let predictError = $("#dpdfrance_predict_error");
        let gsmFormatError = false;
        let gsmDeliveryMobilePhone = dpdfranceGetGsmFromSelectedAddress(selectedAddressId);
        if (gsmDeliveryMobilePhone && gsmDeliveryMobilePhone !== false) {
            gsmDeliveryMobilePhone = gsmDeliveryMobilePhone.replace(/\s+/g, '');
            if (gsmNumbersFormatValidation.test(gsmDeliveryMobilePhone)) {
                if (!gsmBasicFormatValidation.test(gsmDeliveryMobilePhone)) {
                    gsmFormatError = true;
                } else {
                    /**
                     * The validation process continues only if the shipping method is predict
                     */
                    let gsmShippingMethod = $("input[name*='delivery_option[']:checked");
                    //Check if the selected input element exist
                    if (gsmShippingMethod.length === 0) {
                        console.log("Veuillez sélectionner une methode de livraison");
                    } else {
                        let gsmShippingMethodValue = gsmShippingMethod.val().slice(0, -1);
                        if (gsmShippingMethodValue === dpdfrancePredictCarrierId) {
                            dpdfrance_checkGSM(gsmDeliveryMobilePhone);
                        }
                    }
                }
            } else {
                gsmFormatError = true;
            }
        } else {
            gsmFormatError = true;
            gsmDeliveryMobilePhone = '';
        }

        /**
         * Display error message if gsm number is incorrect
         */
        if (gsmFormatError) {
            predictGsmButton.css('background-color', '#424143');
            predictGsmButton.html('>');
            predictError.show();

            //Prevent disabling the order button if the gsm number is not provided when not using the predict carrier
            let predictBlockDisplay = $("#div_dpdfrance_predict_block").css('display');
            if (predictBlockDisplay !== 'none') {
                dpdFranceHandleOrderButtonStatus(false);
            }
        }

        /**
         * ? Assign phone number to Predict block input phone number
         */
        document.querySelector("input[name='dpdfrance_predict_gsm_dest']").value = gsmDeliveryMobilePhone;

        /**
         * If click on confirm address, assign phone number to predict input field
         */
        document.querySelector('button[name="confirm-addresses"]').addEventListener('click', () => {
            document.querySelector("input[name='dpdfrance_predict_gsm_dest']").value = gsmDeliveryMobilePhone;
        });

        /**
         * [PREDICT] EVENT LISTENER
         * On the key press in the Predict block phone number input field, check the phone number
         */
        ['keyup', 'focusout'].forEach(function (type) {
            document.querySelector("input#input_dpdfrance_predict_gsm_dest").addEventListener(type, () => {
                dpdfrance_checkGSM();
            });
        });
    }
});
