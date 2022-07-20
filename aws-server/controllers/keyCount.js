// IMPORTS
require('dotenv').config()
const fs = require('fs');
const topology = require("./topology");

/**
 * 
 */
module.exports = class keyCount {
    constructor() {
        this.siteId = topology.getCurrentInfo().siteId;
        this.dest = process.env.KEYS_PATH;
    }

    static getKeyCount(siteId) {
        fs.readdirSync(this.dest + `/${siteId}`, (err, files) => {
            console.log(files.length);
            return files.length;
        })
    }
    
    
}