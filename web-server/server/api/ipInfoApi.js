// IMPORTS.
const ipInfo = require("../models/ipInfo");
const locaions = require("../models/location")
/**
 * Ip Info API class.
 */
module.exports = class IpInfoApi {

    /**
     * Fetches all locaions 
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

    static async fetchIdIpInfoAsync (req, res) {
        const id = req.param.id;
        try {
            ipInfoById = await ipInfo.findById(id);
            res.status(200).json(ipInfoById);
        }  catch (err) {
             res.status(404).json({message: err.message});
        }
     }

     static async fetchIpIpInfoAsync (req, res) {
        const ip = req.param.ip;
        try {
             const ipInfoById = await ipInfo.findOne({ip: ip});
             res.status(200).json(ipInfoById);
        }  catch (err) {
             res.status(404).json({message: err.message});
        }
     }

    static async createIpInfoAsync(req, res) {
        const ip = req.body.ip;
        const locationId = req.body.locationId;  
        try  {
            await ipInfo.create({
                ip: ip,
                locaion: locaions.findById(locationId)
            });
            res.status(201).json({message: "Post Created Succesfully"});
        } catch (err) {
            res.status(404).json({message: err.message});
        }
    }

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
    
    static async deleteIpInfoAsync(req, res) {
        const id = req.param.id;  

        try  {
            await ipInfo.findByIdAndDelete(id);
            res.status(204).json({message: "Post Created Succesfully"});
        } catch (err) {
            res.status(404).json({message: err.message});
        }
    }
    
};