const brandService = require("../services/brands.services");
const { decompress } = require("compress-json")



// Function to fetch the latest brands file data posted to the backend
const fetchLast = async (req, res) => {
  try {
    const data = await brandService.getLast()
    if (data) {
      res.status(200).send(data)
    }
    else {
      res.status(404).send("No brand found")
    }
  }
  catch (err) {
    console.log(err);
  }
}

// Function to upload the brands file data to the database
const postBrands = async (req, res) => {
  try {
    const data = decompress(req.body);
    const response = await brandService.uploadBrands(data);
    if (!response) {
      res.status(204).send("File cannot be uploaded")
    }
    else {
      res.status(201).send(response);
    }
  }
  catch (err) {
    res.status(500).send(err)
  }
}

module.exports = { postBrands,fetchLast }