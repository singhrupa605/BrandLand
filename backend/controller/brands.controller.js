const { decompress } = require("compress-json")
const dataStream = require("../utils/datastream")



const uploadGridFsBrand = async (req, res) => {
  await dataStream.readData(req, res, "brands.files", "brands.chunks", 'brands')
}




module.exports = {uploadGridFsBrand }