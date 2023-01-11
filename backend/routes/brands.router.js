const express = require("express");
const router = express.Router();
const brandController = require("../controller/brands.controller")


//Route to post the brands file data to the database
router.post("/", brandController.postBrands)

// Route to get the latest uploaded brands  file data
router.get("/latest" ,brandController.fetchLast);

module.exports = router;