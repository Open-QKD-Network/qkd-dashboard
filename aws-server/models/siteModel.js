/**
 * Single Site Class.
 * @param {string} siteId The name of the site ID. (A, B, etc...)
 * @param {string} ip IP address of coresponding site.
 */
class Site {
    constructor (siteData) {
        this.siteId = siteData.siteId;
        this.ip = siteData.ip
    }
}

module.exports = {
    Site: Site
}