'use strict';

var Site = require('dw/system/Site');
var retailtuneHelpers = require('~/cartridge/scripts/retailtune/retailtuneHelpers');

/* Script Modules */
var app = require('*/cartridge/scripts/app'),
	guard = require('*/cartridge/scripts/guard');

function stores() {
    
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

    app.getView({config: configObj}).render('retailtune/stores/stores');
}

/**
 * 
 */
function siteMap() {
    var resultObj = null;
    var language = request.locale || "it"; 
    var locale = request.locale;

    if (language.indexOf("_") > -1){
        language = language.substring(0,language.indexOf("_"));
    }
    
    try {
        resultObj = retailtuneHelpers.getSitemapFromAPI(language, locale);
    } catch (e) {
        dw.system.Logger.getLogger("Retailtune", "Sitemap").error("Error occurred", e);
    }    

    var xmlSitemap = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
    xmlSitemap += resultObj.content;

    try {
        response.setContentType("text/xml");
        response.getWriter().print(xmlSitemap);
    } catch (e) {
        throw new Error(e.message + '\n\r' + e.stack, e.fileName, e.lineNumber);
    }

}

/*
 * Module exports
 */

exports.Stores = guard.ensure(['get'], stores);
/** Renders the storelocator sitemap.
 * @see {@link module:controllers/Storelocator~siteMap} */
exports.SiteMap = guard.ensure(['get'], siteMap);