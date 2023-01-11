const express = require("express")
const brandRoute = require("./brands.router")
const domainRoute = require("./alldomain.router")
const router = express.Router();


router.use("/upload/brands", brandRoute);
router.use("/upload/domains", domainRoute)



module.exports = router;