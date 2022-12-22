//IMPORTS
const fetch = require("node-fetch");

/**
 * Backend topology class.
 */
module.exports = class Topology {
    /**
     * Returns aync call for topology.
     * @param {String} ip IP address for fetch call.
     * @returns async fetch call for the JSON of the topology for provided IP.
     */
    static async getTopologyAsync(ip) {
        return fetch(`http://${ip}:${process.env.AWS_PORT_REST}/api/v1/siteInformation/topology`)
            .then(response=> response.json())
            .then((jsonResponse)=> {return jsonResponse});
    }
}
