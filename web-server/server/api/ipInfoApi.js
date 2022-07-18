// IMPORTS.
const ipInfo = require("../models/ipInfo");
const locaions = require("../models/location")
/**
 * Ip Info API class.
 */
module.exports = class IpInfoApi {

    /**
     * Fetches all IpInfo. 
     * @param {any} req http request object.
     * @param {any} res http response object.
     */
    static async fetchAllIpInfoAsync(req, res) {
        try  {
            const ipInfos = await ipInfo.find();
            res.status(200).json(ipInfos);
        } catch (err) {
            res.status(404).json({message: err.message});
        }
    }

    /**
     * Fetches IpInfo with given ID. 
     * @param {any} req http request object.
     * @param {any} res http response object.
     */
    static async fetchIdIpInfoAsync (req, res) {
        const id = req.params.id;
        try {
            ipInfoById = await ipInfo.findById(id);
            res.status(200).json(ipInfoById);
        }  catch (err) {
             res.status(404).json({message: err.message});
        }
     }

     /**
     * Fetches IpInfo with given IP. 
     * @param {any} req http request object.
     * @param {any} res http response object.
     */
     static async fetchIpIpInfoAsync (req, res) {
        try {
            const ip = req.params.ip;

            const ipInfoById = await ipInfo.findOne({ip: ip});
            res.status(200).json(ipInfoById);
        }  catch (err) {
            res.status(404).json({message: err.message});
        }
     }

    /**
     * Creates new IpInfo. 
     * @param {any} req http request object.
     * @param {any} res http response object.
     */
    static async createIpInfoAsync(req, res) {  
        try  {
            const ip = req.body.ip;
            const locationId = req.body.locationId;
            
            await ipInfo.create({
                ip: ip,
                locaion: locaions.findById(locationId)
            });
            res.status(201).json({message: "Post Created Succesfully"});
        } catch (err) {
            res.status(404).json({message: err.message});
        }
    }

    /**
     * Updates IpInfo with given ID. 
     * @param {any} req http request object.
     * @param {any} res http response object.
     */
    static async updateIpInfoAsync(req, res) {
        try  { 
            const ipInfoById = await location.findById(id);

            if (req.body.ip) ipInfoById.ip = req.body.ip
            if (req.body.locationId) ipInfoById.locaion = locaions.findById(req.body.locationId)

            await ipInfoById.save()
            res.status(201).json({message: "Post Created Succesfully"});
        } catch (err) {
            res.status(404).json({message: err.message});
        }
    }
    
    /**
     * Deletes IpInfo with given ID. 
     * @param {any} req http request object.
     * @param {any} res http response object.
     */
    static async deleteIpInfoAsync(req, res) {
        const id = req.params.id;  

        try  {
            await ipInfo.findByIdAndDelete(id);
            res.status(204).json({message: "Post Created Succesfully"});
        } catch (err) {
            res.status(404).json({message: err.message});
        }
    }
    
};