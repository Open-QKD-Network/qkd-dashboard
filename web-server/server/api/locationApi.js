// IMPORTS.
const location = require("../models/location");

/**
 * Location API class.
 */
module.exports = class LocationApi {

    /**
     * Fetches all locaions 
     * @param {any} req http request object.
     * @param {any} res http response object.
     */
    static async fetchAllLocationsAsync(req, res) {
        try  {
            const posts = await location.find();
            res.status(200).json(posts);
        } catch (err) {
            res.status(404).json({message: err.message});
        }
    }

    /**
     * Fetches locaion with given ID. 
     * @param {any} req http request object.
     * @param {any} res http response object.
     */
    static async fetchIdLocationAsync (req, res) {
        const id = req.params.id;
        try {
             const locationById = await location.findById(id);
             res.status(200).json(locationById);
        }  catch (err) {
             res.status(404).json({message: err.message});
        }
    }

    /**
     * Fetches locaion with given city. 
     * @param {any} req http request object.
     * @param {any} res http response object.
     */
    static async fetchCityLocationAsync (req, res) {
        const city = req.params.city;
        try {
             const locationByCity = await location.findOne({city: city});
             res.status(200).json(locationByCity);
        }  catch (err) {
             res.status(404).json({message: err.message});
        }
    }

    /**
     * Creates new locaion. 
     * @param {any} req http request object.
     * @param {any} res http response object.
     */
    static async createLocationAsync(req, res) {
        const newLocation = req.body;  

        try  {
            await location.create(newLocation);
            res.status(201).json({message: "Post Created Succesfully"});
        } catch (err) {
            res.status(404).json({message: err.message});
        }
    }

    /**
     * Updates locaion with given ID. 
     * @param {any} req http request object.
     * @param {any} res http response object.
     */
    static async updateLocationAsync(req, res) {
        const id = req.params.id;  
        try  {
            const locationById = await location.findById(id);

            if (req.body.city) locationById.city = req.body.city
            if (req.body.longitude) locationById.longitude = req.body.longitude
            if (req.body.latitude) locationById.latitude = req.body.latitude

            await locationById.save()
            res.status(200).json({message: "Post Updated Succesfully"});
        } catch (err) {
            res.status(404).json({message: err.message});
        }
    }

    /**
     * Deletes locaion with given ID. 
     * @param {any} req http request object.
     * @param {any} res http response object.
     */
    static async deleteLocationAsync(req, res) {
        const id = req.params.id;  
        try  {
            await location.findByIdAndDelete(id);

            res.status(204).json({message: "Post Deleted Succesfully"});
        } catch (err) {
            res.status(404).json({message: err.message});
        }
    }
};