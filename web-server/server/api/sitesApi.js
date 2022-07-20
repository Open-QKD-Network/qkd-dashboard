const ipInfo = require("../models/ipInfo");
const topology = require("../controllers/topology");

module.exports = class SitesApi {

    /**
     * Fetches all Topologies for the IPs in ipInfo. 
     * @param {any} req http request object.
     * @param {any} res http response object.
     */
    static async fetchAllTopologiesAsync(req, res) {
        try  {
            const topologies = [];
            const ipInfos = await ipInfo.find().exec(async function(err, ipJson) {
                for (var i in ipJson) {
                    var ip = ipJson[i].ip;
                    topologies.push({[ip] : await topology.getTopologyAsync(ip)});
                }
                res.status(200).json(topologies);
            });
        } catch (err) {
            res.status(404).json({message: err.message});
        }
    }
}