// IMPORTS.
const { string } = require("joi");
const location = require("../models/location");
const mongoose = require("mongoose");


/**
 * ipInfo Model Schema.
 * @param {String} ip IP address of machine.
 * @param {locaion} locaion JSON object of location (Refrence location).
 */
const ipInfoSchema = mongoose.Schema({
    ip: String,
    locationId: String
});

module.exports = mongoose.model("ipInfo", ipInfoSchema);