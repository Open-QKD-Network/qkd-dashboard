// IMPORTS.
const { string } = require("joi");
const location = require("../models/location");
const mongoose = require("mongoose");


/**
 * ipInfo Model Schema.
 */
const ipInfoSchema = mongoose.Schema({
    ip: String,
    locaion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'location'
        },
});

module.exports = mongoose.model("ipInfo", ipInfoSchema);