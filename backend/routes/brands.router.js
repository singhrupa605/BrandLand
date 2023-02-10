const express = require("express");
const router = express.Router();
const brandController = require("../controller/brands.controller")
const bucketstorage = require("../utils/datastream")

router.post("/brand" , bucketstorage.brandupload,  brandController.uploadGridFsBrand)



module.exports = router;