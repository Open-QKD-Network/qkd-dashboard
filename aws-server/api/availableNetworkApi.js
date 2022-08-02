const Connection = require("../controllers/connections");

/**
 * Site Information API class.
 */
module.exports = class AvailableNetworkApi {

    static async fetchTopologyAsync(req, res) {
        try  {
            const available = Connection.checkIfFileExists();
            res.status(200).json({available: available});
        } catch (err) {
            res.status(404).json({message: err.message});
        }
    }
}