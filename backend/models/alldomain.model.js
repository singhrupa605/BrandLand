const mongoose = require("mongoose");


// Mongo Schema for array of domain
const domainArraySchema = new mongoose.Schema({
    domains : Array
})


const Domains = mongoose.model("Domains", domainArraySchema)
module.exports = Domains;