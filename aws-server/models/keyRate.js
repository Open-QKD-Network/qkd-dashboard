/**
 * Key rate class.
 * @param {string} siteId The name of the site ID. (A, B, etc...)
 * @param {string} neigbourId The name of the neighbour ID. (A, B, etc...)
 * @param {string} rate Rate of key production between siteId and neighbourId.
 */
 class KeyRate {
    constructor (siteData) {
        this.siteId = siteData.siteId;
        this.ip = siteData.ip;
        this.rate = siteData.rate;
    }
}

module.exports = {
    Site: KeyRate
}