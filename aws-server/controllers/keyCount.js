// IMPORTS
require('dotenv').config()
const fs = require('fs');
const topology = require("./topology");

/**
 * Class that handles key counts.
 */
module.exports = class keyCount {
    constructor() {
        this.siteId = topology.getCurrentInfo().siteId;
        this.dest = process.env.KEYS_PATH;
    }

    getKeyCount = function (siteId) {
        return fs.readdirSync(`${this.dest}/${siteId}`).length;
    }
    
    
}