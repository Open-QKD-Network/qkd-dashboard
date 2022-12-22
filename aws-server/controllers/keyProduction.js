// IMPORTS
require('dotenv').config()
const fs = require('fs');
const topology = require("./topology");
const KeyRate = require('../models/keyRate');
const KeyCount = require('../models/keyCount');

/**
 * Class that handles key counts.
 */
module.exports = class KeyProduction {
    constructor() {
        this.dest = process.env.KEYS_PATH;

        var neighboursJson = topology.getNeigbourInfo();
        this.siteId = topology.getCurrentInfo().siteId;
        this.siteKeyJson = {};

        for (var i in neighboursJson) {
            this.siteKeyJson[neighboursJson[i].siteId] = this.getKeyCount(neighboursJson[i].siteId);
        }
    }

    /**
     * Reads file destination and checks the number of keys.
     * @param {String} neighbourId Neighbour site ID.
     * @returns Number of keys for neighbout site.
     */
    getKeyCount = function (neighbourId) {
        return fs.readdirSync(`${this.dest}/${neighbourId}`).length - 1;
    }
    
    /**
     * Calculates the key rate between the current site and all neighbour site.
     * @param {int} time time between checks, in seconds.
     * @returns Array of KeyRate JSON.
     */
    calculateKeyRate = function (time) {
        var neighborKeyRates = [];
        for (var neighbourId in this.siteKeyJson) {
            var currentKeyCount = this.getKeyCount(neighbourId);
            var rate = (currentKeyCount - this.siteKeyJson[neighbourId]) / time;
            this.siteKeyJson[neighbourId] = currentKeyCount;
            neighborKeyRates.push(new KeyRate.KeyRate({siteId: this.siteId, neighbourId: neighbourId, rate: rate}));
        }
        return neighborKeyRates;
    }

    /**
     * Calculates the number of keys between the current site and neighbour site.
     * @param {String} neighbourId ID of neighbour whos key count we check.
     * @returns KeyCount Json.
     */
    calculateKeyCount = function () {
        var neighborKeyCount = [];
        for (var neighbourId in this.siteKeyJson) {
            neighborKeyCount.push(new KeyCount.KeyCount({siteId: this.siteId, neighbourId: neighbourId, count: this.getKeyCount(neighbourId)}));
        }
        return neighborKeyCount;
    }
    
}
