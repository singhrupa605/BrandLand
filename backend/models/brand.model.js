const mongoose = require("mongoose");

//Mongoose schema for individual brand info
const brandSchema = new mongoose.Schema({
    "Brand ID": {
        type: String,
        required: true,
    },
    "Name":
    {
        type: String,
        required: true,
    },

    "Top Level Domain":
    {
        type: String,
    }
    ,
    "Bundles":
    {
        type: String
    }
    ,
    "Industry":
    {
        type: String
    }


})
module.exports.brandSchema = brandSchema;