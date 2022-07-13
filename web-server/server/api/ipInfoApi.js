// IMPORTS.
const post = require("../models/location");

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
            const posts = await post.find();
            res.status(200).json(posts);
        } catch (err) {
            res.status(404).json({message: err.message});
        }
    }

    static async createIpInfoAsync(req, res) {
        const posts = req.body;  
        console.log(posts);
        try  {
            await post.create(posts);
            res.status(201).json({message: "Post Created Succesfully"});
        } catch (err) {
            res.status(404).json({message: err.message});
        }
    }

    static async fetchIdIpInfoAsync (req, res) {
        
    }
    
};