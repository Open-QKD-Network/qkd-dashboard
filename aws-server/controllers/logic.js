//IMPORTS.
require('dotenv').config()
const fs = require('fs');
const site = require('../models/siteModel');
const topology = require('../models/topologyModel');

/**
 * Class container for logic functions.
 */
module.exports = class logicControllers {


    static getTopology() {
        try {
            return JSON.stringify(new topology.Topology({"current": this.getCurrentInfo(), "neighbours": this.getNeigbourInfo()}));
        } catch (e) {
            console.log(e);
            throw new Error("ERROR WHEN CREATING TOPOLOGY");
        }
    }

    /**
     * Retrieves the site ID and IP address from current node for the 
     * path specified in the .env file.
     */ 
    static getCurrentInfo() {
        var siteId;
        var ip;
        try {
            siteId = fs.readFileSync(process.env.KMS_CONF_PATH, 'utf8');
            siteId = siteId.split('\n')[3];
        } catch (e) {
            console.log(e)
            throw new Error("ERROR WHEN RECIEVING SITE ID");
        }
        
        try {
            var siteagentString = fs.readFileSync(process.env.SITEAGENT_JSON_PATH, 'utf8');
            var siteagentJson = JSON.parse(siteagentString);
            ip = siteagentJson['url'];
        } catch (e) {
            console.log(e)
            throw new Error("ERROR WHEN RECIEVING IP");
        }

        var siteClass = new site.Site({"siteId": siteId, "ip": ip});
        return siteClass;
    }

    /**
     * Retrieves the site ID and IP address from path specified in the .env file
     * and returns list of neighbours sites.
     */ 
     static getNeigbourInfo() {
        try {
            var routesString = fs.readFileSync(process.env.ROUTES_JSON_PATH, 'utf8');
            var routesJson = JSON.parse(routesString);
            routesJson = routesJson["adjacent"];
            var neighbours = [];
            for (var i in routesJson) {
                neighbours.push(new site.Site({"siteId": i, "ip": routesJson[i]}));
            }
            return neighbours;
        } catch (e) {
            throw new Error("Site ID path doesn't exist.");
        }
    }

}  