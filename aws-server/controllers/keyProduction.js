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
     * 
     * @param {String} neigbourId 
     * @returns 
     */
    getKeyCount = function (neigbourId) {
        return fs.readdirSync(`${this.dest}/${neigbourId}`).length - 1;
    }
    
    /**
     * Calculates the key rate between the current site and all neigbour site.
     * @param {int} time time between checks, in seconds.
     * @returns Array of KeyRate JSON.
     */
    calculateKeyRate = function (time) {
        var neighborKeyRates = [];
        for (var neigbourId in this.siteKeyJson) {
            var currentKeyCount = this.getKeyCount(neigbourId);
            var rate = (currentKeyCount - this.siteKeyJson[neigbourId]) / time;
            this.siteKeyJson[neigbourId] = currentKeyCount;
            neighborKeyRates.push(new KeyRate({siteId: [this.siteId], neigbourId: [neigbourId], rate: [rate]}));
        }
        return neighborKeyRates;
    }

    /**
     * Calculates the number of keys between the current site and neigbour site.
     * @param {String} neigbourId ID of neighbour whos key count we check.
     * @returns KeyCount Json.
     */
    calculateKeyCount = function () {
        var neighborKeyCount = [];
        for (var neigbourId in this.siteKeyJson) {
            neighborKeyCount.push(new KeyCount({siteId: [this.siteId], neigbourId: [neigbourId], count: [this.getKeyCount(neigbourId)]}));
        }
        return neighborKeyCount;
    }
    
}