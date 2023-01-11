const mongoose = require("mongoose");
const {brandSchema} = require("./brand.model");


//Mongoose Schema for brands array
const brandArraySchema = new mongoose.Schema({
    brands : []
})


const Brands = mongoose.model("Brands", brandArraySchema)
module.exports = Brands