/**
 * Ip Info API class.
 */
module.exports = class siteInformationApi {

    static async fetchTopologyAsync(req, res) {
        try  {
            const localTopology = topology.getTopology()
            res.status(200).json(localTopology);
        } catch (err) {
            res.status(404).json({message: err.message});
        }
    }
}