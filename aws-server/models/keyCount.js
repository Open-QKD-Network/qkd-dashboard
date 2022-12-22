/**
 * Key Count class.
 * @param {string} siteId The name of the site ID. (A, B, etc...)
 * @param {string} neighbourId The name of the neighbour ID. (A, B, etc...)
 * @param {string} count Number of keys between iteId and neighbourId.
 */
 class KeyCount {
    constructor (siteData) {
        this.siteId = siteData.siteId;
        this.neighbourId = siteData.neighbourId;
        this.count = siteData.count;
    }
}

module.exports = {
    KeyCount: KeyCount
}
