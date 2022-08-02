const Connection = require("../controllers/connections");

/**
 * Site Information API class.
 */
module.exports = class AvailableNetworkApi {
    constructor () {
        this.connectionClass = new Connection;
    }
    static async fetchTopologyAsync(req, res) {
        try  {
            const available = this.connectionClass.checkIfFileExists();
            res.status(200).json({available: available});
        } catch (err) {
            res.status(404).json({message: err.message});
        }
    }
}