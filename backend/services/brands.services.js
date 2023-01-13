const Brands = require("../models/brand_array")



/*
   Function to find the data of latest added brand file to the database 
        @param  {null}
        @return {Array} : array of brands 
*/
const getLast = async () => {
    try {
        const data = await Brands.find().sort({ _id: -1 }).limit(1)
        console.log("last brand Id:" + data[0]._id)
        return data[0].brands
    }
    catch (err) {
        console.log(err)
        return null;
    }
}



/*
     ********* Function to upload the brands file data to the database ************
     If the array of brands length  > 10000 then first  a document of array  of  10000 brands 
     will be created and then the subsequent groups of 10000 brands will be added to the same document 
     using the its id 

        @param {Array} data : Array of objects of brands from the brands file
        @return {ObjectId} : Mongo Id of the created document

*/
const uploadBrands = async (data) => {
    let brand_Id;
    try {
        if (data.length > 1000) {
            const splitted = data.splice(0, 1000);
            let res = await Brands.create({ brands: splitted });
            let id = res._id.toString()
            brand_Id = res._id;
            let brand = await Brands.findById(id);
            while (data.length) {
                const split = data.splice(0, 1000);
                const newArray = [...brand.brands.concat(split)]
                console.log(newArray)
                brand.brands = [...newArray];
                await brand.save()
            }
        }
        else {

            let uploadResponse = await Brands.create({ brands: data });
            brand_Id = uploadResponse._id;
        }
        console.log(brand_Id)
        return brand_Id;

    }
    catch (err) {
        console.log(err);
        return null;
    }
}

module.exports = { uploadBrands, getLast }
