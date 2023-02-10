const express = require("express");
const router = express.Router();
const domainsController = require("../controller/domains.controller")
const bucketstorage = require("../utils/datastream")

// Route to check if domain is reachable
router.post("/reachable", domainsController.isDomainReachable)

router.post("/singlereachable", domainsController.isSingleDomainReachable)
 
router.post("/domain", bucketstorage.domainupload, domainsController.uploadGridFsDomain)


module.exports = router;