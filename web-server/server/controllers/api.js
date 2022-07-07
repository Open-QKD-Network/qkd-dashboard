const post = require("../models/posts");

module.exports = class API {
    static async fetchAllPosts(req, res) {
        try  {
            const posts = await post.find();
            res.status(200).json(posts);
        } catch (err) {
            res.status(404).json({message: err.message});
        }
    }

    static async createPost(req, res) {
        // req.query
        const posts = req.body;  
        console.log(posts);
        try  {
            await post.create(posts);
            res.status(201).json({message: "Post Created Succesfully"});
        } catch (err) {
            res.status(404).json({message: err.message});
        }
    }
    
};