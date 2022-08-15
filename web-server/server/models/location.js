// IMPORTS.
const { string } = require("joi");
const mongoose = require("mongoose");

/**
 * locations Model Schema.
 * @param {String} city Name of city.
 * @param {String} longitude Longtitudinal direction of city (positive for east, negative for west).
 * @param {String} latitude Latitudinal direction of city (positive for north, negative for south).
 */
const locationsSchema = mongoose.Schema({
    city: String,
    longitude: String,
    latitude: String
});

module.exports = mongoose.model("locations", locationsSchema);