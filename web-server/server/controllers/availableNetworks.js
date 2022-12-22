//IMPORTS
const fetch = require("node-fetch");

/**
 * Backend topology class.
 */
module.exports = class AvailableNetwork {
    /**
     * Returns aync call for availableNetwork.
     * @param {String} ip IP address for fetch call.
     * @returns async fetch call for the JSON of the availablibility of the network for provided IP.
     */
    static async getAvailableNetworkAsync(ip) {
        return fetch(`http://${ip}:${process.env.AWS_PORT_REST}/api/v1/availableNetwork/isAvailable`)
            .then(response=> response.json())
            .then((jsonResponse)=> {return jsonResponse});
    }
}
