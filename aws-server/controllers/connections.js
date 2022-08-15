// IMPORTS
require('dotenv').config()
const fs = require('fs');

/**
 * Class that handles connection status.
 */
module.exports = class Connection {
    constructor() {
        this.dest = process.env.LSRP_JSON_PATH;
    }

    /**
     * Checks if lsrp.json exists.
     * @returns Bool on the existance of lsrp.json.
     */
    checkIfFileExists = function () {
        try {
            return fs.existsSync(this.dest);
        } catch (e){
            console.error("ERROR ON FINDING lsrp.json: " + e)
        }
    }
    
    /**
     * Returns conection status by reading lsrp.json.
     * @returns JSON of lsrp.json.
     */
    findConnectionStatus = function () {
        try {
            if (this.checkIfFileExists()) {
                const lsrp = fs.readFileSync(this.dest, 'utf8');
                return JSON.parse(lsrp);
            }
        } catch (e) {
            console.error("ERROR ON READING lsrp.json: " + e)
        }
        
    }
    
}