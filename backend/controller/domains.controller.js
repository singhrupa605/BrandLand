const domainService = require("../services/domains.services")
const dataStream = require("../utils/datastream")




// Function to check if a domain is reachable or not and send the boolean response to the frontend
const isDomainReachable = async (req, res) => {
    try {
        const data = await domainService.isDomainReachable(req.body.domains)
      //  console.log(data.length)
        if (data.length>0) {
            res.status(200).send(data);
        }
        else {
            res.status(204).send("Invalid data");
        }

    }
    catch (err) {
        console.log(err)
        res.sendStatus(400)
    }
}

// Function to check if a domain is reachable or not and send the boolean response to the frontend
const isSingleDomainReachable = async (req, res) => {
    try {
        const data = await domainService.isSingleDomainReachable(req.body.domain)
        console.log(data)
        if (data) {
            res.status(200).send(data);
        }
        else {
            res.status(204).send("Invalid data");
        }

    }
    catch (err) {
        console.log(err)
        res.sendStatus(400)
    }
}






const uploadGridFsDomain = async (req, res) => {
    await dataStream.readData(req, res, 'domains.files', 'domains.chunks', 'domains')
}


module.exports = { isDomainReachable, uploadGridFsDomain,isSingleDomainReachable }