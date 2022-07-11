module.exports = {
    /**
     * Fetches all locaions 
     * @param {any} req http request object.
     * @param {any} res http response object.
     */
     static async fetchAllLocationsAsync(req, res) {
        try  {
            res.status(200).json();
        } catch (err) {
            res.status(404).json({message: err.message});
        }
    }
}