const express = require("express");
const router = express.Router();
const domainsController = require("../controller/domains.controller")

// Route to post the domains file data
router.post("/", domainsController.postDomains)

// Route to get the latest uploaded domains file data
router.get("/latest", domainsController.getLastDomain)

// Route to check if domain is reachable
router.post("/reachable", domainsController.isDomainReachable)




module.exports = router;