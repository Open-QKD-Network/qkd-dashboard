// IMPORTS.
const { string } = require("joi");
const mongoose = require("mongoose");

/**
 * locations Model Schema.
 */
const locationsSchema = mongoose.Schema({
    city: String,
    longitude: String,
    latitude: String
});

module.exports = mongoose.model("locations", locationsSchema);