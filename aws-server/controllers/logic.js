//IMPORTS.
const fs = require('fs');
const site = require('../models/siteModel');
/**
 * Class container for logic functions.
 */
module.exports = class logicControllers {

    /**
     * Retrieves get siteId from path specified in the .env file.
     */ 
    static getSiteId(params) {
        try {
            // var siteId = fs.readFileSync(process.env.KMS_CONF_PATH, 'utf8');
            // siteId = siteId.split('\n')[3];
            var siteId = "A"; //tmp
            var siteClass = new site.Site({"siteId": siteId});
            return JSON.stringify(siteClass);
        } catch (e) {
            console.log(e)
            throw new Error("Site ID path doesn't exist.");
        }
    }

    /**
     * Retrieves get siteId from path specified in the .env file.
     */ 
     static getConnectionStatus(params) {
        try {
            var siteId = fs.readFileSync(process.env.KMS_CONF_PATH, 'utf8');
            siteId = siteId.split('\n')[3];
            return siteId;
        } catch (e) {
            throw new Error("Site ID path doesn't exist.");
        }
    }

}  