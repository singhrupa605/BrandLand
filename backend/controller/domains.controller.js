const domainService = require("../services/domains.services")
const { decompress } = require("compress-json")



// Function to get the data of latest uploaded domains file and send the data to the frontend
const getLastDomain = async (req, res) => {
    try {
        const data = await domainService.getLastDomain()
        if (data) {
            res.status(200).send(data)
        }
        else {
            res.status(404).send("Domains list does not exist")
        }
    }
    catch (err) {
        console.log(err)
    }
}


// Function to check if a domain is reachable or not and send the boolean response to the frontend
const isDomainReachable = async (req, res) => {
    try {
        const data = await domainService.isDomainReachable(req.body.domains)
        if(data.length){
            res.status(201).send(data);
        }
        else {
            res.status(204).send("Invalid data");
        }
        
    }
    catch (err) {
        console.log(err)
    }
}


// Function to post the domain file data to the database
const postDomains = async (req, res) => {
    try {
        const domainList = decompress(req.body);
        const response = await domainService.uploadDomains(domainList);
        if (response) {
            res.status(201).send(response._id)
        }
        else {
            res.status(204).send("Data cannot be posted")
        }
    }
    catch (err) {
        console.log(err)
    }
}



module.exports = { postDomains,  isDomainReachable , getLastDomain}