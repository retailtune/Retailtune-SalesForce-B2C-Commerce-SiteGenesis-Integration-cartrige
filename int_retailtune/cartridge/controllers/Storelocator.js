'use strict';

var Site = require('dw/system/Site');
var retailtuneHelpers = require('~/cartridge/scripts/retailtune/retailtuneHelpers');

/* Script Modules */
var app = require('~/cartridge/scripts/app'), guard = require('~/cartridge/scripts/guard');

function stores() {
    //dw.system.Logger.info("Retailtune", "Stores-GET").info("Retialtune Store Locator");
    
    var configObj = {}; 

    var rtPipeline = Site.getCurrent().getCustomPreferenceValue('retailtune_pipeline_name') || "stores";
    
    var locale = request.httpParameterMap.locale.value || "it"; 
    if (locale.indexOf("/") > -1){
        locale = locale.substring(0,locale.indexOf("/"));
    }
    var storepath = request.httpParameterMap.storepath.value || rtPipeline; 
    
    var urlRed = "/"+locale+"/"+(storepath != rtPipeline ? rtPipeline + "/" + storepath : storepath);

    configObj = { 
        currency: session.currency.currencyCode,
        locale: locale,
        apiKey: Site.getCurrent().getCustomPreferenceValue('retailtune_apiKey_services'),
        result: retailtuneHelpers.getHtmlCodeFromAPI("head", urlRed, locale),
        
        urlred: urlRed
    };
    /*
    try {
        configObj = { 
            currency: session.currency.currencyCode,
            locale: request.httpParameterMap.locale.id.value,
            apiKey: Site.getCurrent().getCustomPreferenceValue('retailtune_apiKey_services'),
            result: retailtuneHelpers.getHtmlCodeFromAPI("head", urlRed),
            urlred: urlRed
    };
    } catch (e) {
        //dw.system.Logger.info("Retailtune", "Stores").error("Error occurred", e);
    }   */

    app.getView({config: configObj}).render('retailtune/stores/stores');
}

/*
 * Module exports
 */

exports.Stores = guard.ensure(['get'], stores);