// IMPORTS.
const { string } = require("joi");
const locaion = require("./location");
const mongoose = require("mongoose");

const ipInfoSchema = mongoose.Schema({
    ip: String,
    locaion: locaion.locationsSchema,
});

module.exports = mongoose.model("locations", locationsSchema);