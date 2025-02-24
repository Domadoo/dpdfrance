/*!
 * DPD France - JavaScript
 * version: 1.0 (Mon, 23 AUT 2021)
 * @requires jQuery v1.6 or later
 *
 *
 * Copyright 2021 DPD France
 *
 */
$(document).ready(function () {
    let connectionSetting = $('#mod_connect');
    let extensionFileSetting = $('#mod_format');
    let printFormatSetting = $('#print_format');
    let inputPrinterPort = $('input[name="format_printer_port"]');
    let inputPrinterIp = $('input[name="format_printer_ip"]');

    if (newCarrierId) {
        $('#onglet2').click();
        if (newCarrierId !== 'dpdfrance_world_carrier_id') {
            dpdfrance_attr_carrier($('[name=' + newCarrierId + ']'));
        }
    }

    $('body').on('change', '#mod_format', function (e) {
        let value = $(this).val();
        let optionFile = $('#a4');
        if (value === 'pdf') {
            optionFile.show();
        } else {
            optionFile.hide();
            $('#a6').prop('selected', true);
        }
    })

    $('body').on('change', '#services', function (e) {
        let value = $(this).val();

        if (value === 'station_dat') {
            printFormatSetting.addClass('disabled');
            printFormatSetting.attr('disabled', true);
            extensionFileSetting.addClass('disabled');
            extensionFileSetting.attr('disabled', true);
            connectionSetting.addClass('disabled');
            connectionSetting.attr('disabled', true);
            inputPrinterPort.addClass('disabled');
            inputPrinterPort.attr('disabled', true);
            inputPrinterIp.addClass('disabled');
            inputPrinterIp.attr('disabled', true);
        } else if (value === 'e_print') {
            printFormatSetting.removeClass('disabled');
            printFormatSetting.removeAttr('disabled');
            extensionFileSetting.removeClass('disabled');
            extensionFileSetting.removeAttr('disabled');
            connectionSetting.removeClass('disabled');
            connectionSetting.removeAttr('disabled');
            if (connectionSetting.val() === 'usb') {
                inputPrinterPort.addClass('disabled');
                inputPrinterPort.attr('disabled', true);
                inputPrinterIp.addClass('disabled');
                inputPrinterIp.attr('disabled', true);
            } else {
                inputPrinterPort.removeClass('disabled');
                inputPrinterPort.removeAttr('disabled');
                inputPrinterIp.removeClass('disabled');
                inputPrinterIp.removeAttr('disabled');
            }
        }
    });

    $('body').on('change', '#mod_connect', function (e) {
        let value = $(this).val();
        if (value === 'usb') {
            inputPrinterPort.addClass('disabled');
            inputPrinterPort.attr('disabled', true);
            inputPrinterIp.addClass('disabled');
            inputPrinterIp.attr('disabled', true);
            $('#mod_format option[value="zpl"]').hide();
            $('#mod_format option[value="epl"]').hide();
            $('#mod_format option[value="pdf"]').prop('selected', true);
            $('#print_format option[value="a4"]').show();
            $('#print_format option[value="a4"]').prop('selected', true);

        } else if (value === 'ip') {
            inputPrinterPort.removeClass('disabled');
            inputPrinterPort.removeAttr('disabled');
            inputPrinterIp.removeClass('disabled');
            inputPrinterIp.removeAttr('disabled');
            $('#mod_format option[value="zpl"]').show();
            $('#mod_format option[value="epl"]').show();
            $('#mod_format option[value="zpl"]').prop('selected', true);
            $('#print_format option[value="a4"]').hide();
            $('#print_format option[value="a6"]').prop('selected', true);
        }
    });

    $('body').on('change', '#hide_network', function (e) {
        let hide = $(this).val();
        if (hide == 'true') {
            $('#mod_connect option[value="ip"]').show();
        }
    })

    let service = $('#services').val();
    if (service === 'station_dat') {
        printFormatSetting.addClass('disabled');
        printFormatSetting.attr('disabled', true);
        extensionFileSetting.addClass('disabled');
        extensionFileSetting.attr('disabled', true);
        connectionSetting.addClass('disabled');
        connectionSetting.attr('disabled', true);
        inputPrinterPort.addClass('disabled');
        inputPrinterPort.attr('disabled', true);
        inputPrinterIp.addClass('disabled');
        inputPrinterIp.attr('disabled', true);
    } else if (service === 'e_print') {
        printFormatSetting.removeClass('disabled');
        printFormatSetting.removeAttr('disabled');
        extensionFileSetting.removeClass('disabled');
        extensionFileSetting.removeAttr('disabled');
        connectionSetting.removeClass('disabled');
        connectionSetting.removeAttr('disabled');
        if (connectionSetting.val() === 'usb') {
            inputPrinterPort.addClass('disabled');
            inputPrinterPort.attr('disabled', true);
            inputPrinterIp.addClass('disabled');
            inputPrinterIp.attr('disabled', true);
        } else {
            inputPrinterPort.removeClass('disabled');
            inputPrinterPort.removeAttr('disabled');
            inputPrinterIp.removeClass('disabled');
            inputPrinterIp.removeAttr('disabled');
        }
    }
    let leadTimeDisplay = $('select[name="day_definite_mode"]').val();
    leadTimeDisplay === '1' ? $('#leadtime_config').show() : $('#leadtime_config').hide();
    $('body').on('change', 'select[name="day_definite_mode"]', function (e) {
        let hide_day_definite = $(this).val();
        hide_day_definite === '1' ? $('#leadtime_config').show() : $('#leadtime_config').hide();
    })
})

/**
 * Change the carrier value on select list
 */
let dpdfrance_attr_carrier = (element) => {
    let maxValue = undefined;
    $('option', element).each(function () {
        let val = $(this).attr('value');
        val = parseInt(val, 10);
        if (maxValue === undefined || maxValue < val) {
            maxValue = val;
        }
    });
    element.val(maxValue);
};

/**
 * Open the module doc
 */
const DPDFranceHandleOpenModuleDoc = (pudoUrl = false) => {
    let docPathFinal = pudoUrl ? docPath + '#page=8' : docPath;
    window.open(docPathFinal, 's', 'width= 640, height= 900, left=0, top=0, resizable=yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no');
}

/**
 * Open the google maps api doc
 */
const DPDFranceHandleOpenGmapDoc = () => {
    window.open(docGmapPath, 's', 'width= 640, height= 900, left=0, top=0, resizable=yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no');
}

/**
 * Handle the webservice status message
 */
const dpdFranceWebserviceStatusMsg = (status, origin) => {
    if (origin === 'we') {
        let weValidMsg = $('#dpd_we_status_msg');
        let weAlertMsg = $('#dpd_we_status_msg_alert');

        if (status) {
            if (!weValidMsg.hasClass('active')) {
                weValidMsg.addClass('active');
            }

            if (weAlertMsg.hasClass('active')) {
                weAlertMsg.removeClass('active');
            }
        } else {
            if (weValidMsg.hasClass('active')) {
                weValidMsg.removeClass('active');
            }

            if (!weAlertMsg.hasClass('active')) {
                weAlertMsg.addClass('active');
            }
        }
    } else if (origin === 'wp') {
        let wpValidMsg = $('#dpd_wp_status_msg');
        let wpAlertMsg = $('#dpd_wp_status_msg_alert');

        if (status) {
            if (!wpValidMsg.hasClass('active')) {
                wpValidMsg.addClass('active');
            }

            if (wpAlertMsg.hasClass('active')) {
                wpAlertMsg.removeClass('active');
            }
        } else {
            if (wpValidMsg.hasClass('active')) {
                wpValidMsg.removeClass('active');
            }

            if (!wpAlertMsg.hasClass('active')) {
                wpAlertMsg.addClass('active');
            }
        }
    } else if (origin === 'wl') {
        let wlValidMsg = $('#dpd_wl_status_msg');
        let wlAlertMsg = $('#dpd_wl_status_msg_alert');

        if (status) {
            if (!wlValidMsg.hasClass('active')) {
                wlValidMsg.addClass('active');
            }

            if (wlAlertMsg.hasClass('active')) {
                wlAlertMsg.removeClass('active');
            }
        } else {
            if (wlValidMsg.hasClass('active')) {
                wlValidMsg.removeClass('active');
            }

            if (!wlAlertMsg.hasClass('active')) {
                wlAlertMsg.addClass('active');
            }
        }
    } else if (origin === 'ww') {
        let wwValidMsg = $('#dpd_ww_status_msg');
        let wwAlertMsg = $('#dpd_ww_status_msg_alert');

        if (status) {
            if (!wwValidMsg.hasClass('active')) {
                wwValidMsg.addClass('active');
            }

            if (wwAlertMsg.hasClass('active')) {
                wwAlertMsg.removeClass('active');
            }
        } else {
            if (wwValidMsg.hasClass('active')) {
                wwValidMsg.removeClass('active');
            }

            if (!wwAlertMsg.hasClass('active')) {
                wwAlertMsg.addClass('active');
            }
        }
    }
};

/**
 * Check the webservice configuration
 */
const dpdFranceWebserviceStatus = (webservice) => {
    let img = '<img src="' + dpdfrance_img_base_dir + '/views/img/front/relais/loader.gif" alt="loader"/>';
    $('div[id="dpd_' + webservice + '_status_msg"]').parent().children().first().after(img);
    $.ajax({
        type: 'POST', url: dpdfrance_base_dir + '?action_ajax_dpdfrance=ajaxGetWebserviceStatus', data: {
            'webservice_type': webservice,
            'shop_context': shopContext,
            'shop_group_id': shopGroupId,
            'shop_id': shopId,
        }, success: function (resp) {
            $('img[alt="loader"]').remove();
            resp ? dpdFranceWebserviceStatusMsg(true, webservice) : dpdFranceWebserviceStatusMsg(false, webservice);
        }, error: function () {
            $('img[alt="loader"]').remove();
            console.log('Un problème est survenue, merci de réessayer.');
        }
    });
}
