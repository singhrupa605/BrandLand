const config = require("../config/config")
const multer = require("multer")
const crypto = require("crypto")
const path = require("path")
const { GridFsStorage } = require("multer-gridfs-storage")
const XLSX = require("xlsx");
var mongo = require('mongodb');
const mongoose = require("mongoose")



// Instantiating Mongo Client
const client = new mongo.MongoClient(config.mongoose.mongourl);


// Creating mongo Connection
const conn = mongoose.createConnection(config.mongoose.url)


const createBucket = (bucketName)=>
{
    const storage = GridFsStorage({
        url: config.mongoose.url,
        file: (req, file) => {
            return new Promise((resolve, reject) => {
                crypto.randomBytes(16, (err, buff) => {
                    if (err) {
                        return reject(err)
                    }
                    const filename = buff.toString('hex') + path.extname(file.originalname);
                    const fileInfo = {
                        filename: filename,
                        bucketName: bucketName
                    };
                    resolve(fileInfo)
                })
            })
        }
    }
    )
    return storage
}


// Creating brands bucket in gridFs database
const brandstorage = createBucket('brands')
const brandupload = multer({ storage: brandstorage }).single("file")



// Creating domains bucket in gridFs database
const domainstorage = createBucket('domains')
const domainupload = multer({ storage: domainstorage }).single("file")



// Read file buffer and convert to json
const createStream = async (fileId, bucketName) => {
    console.log(fileId)
    await client.connect();
    const database = client.db("gridFs_upload");
    const bucket = new mongo.GridFSBucket(database, { bucketName: bucketName });
    let stream = bucket.openDownloadStream(fileId)
    stream.read();
    let promisedData = await new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', data => {
            chunks.push(data);
        });
        stream.on('end', () => {
            const data = Buffer.concat(chunks);
            let readedData = XLSX.read(data, { type: "buffer" });
            const wsname = readedData.SheetNames[0];
            const ws = readedData.Sheets[wsname];
            /* Convert array to json*/
            const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
            resolve(dataParse)
        })
        stream.on('error', err => {
            console.log(err)
            reject(err);
        });
    })
    return promisedData
}



//Read json data and send as a response to frontend

const readData = async (req, res, filesCollectionName, chunksCollectionName,bucketName) => {
    const collection = conn.db.collection(filesCollectionName)
    const collectionChunks = conn.db.collection(chunksCollectionName);
    console.log(req.file.filename)
    collection.find({ filename: req.file.filename }).toArray(function (err, docs) {
        if (err) {
            res.status(404).json({ title: 'File error', message: 'Error finding file', error: err.errMsg });
        }
        if (!docs || docs.length === 0) {
            res.status(404).json({ title: 'Download Error', message: 'No file found' })
        }
        else {
            //Retrieving the chunks from the db
            collectionChunks.find({ files_id: docs[0]._id }).toArray(async function (err, chunks) {
                if (err) {
                    res.json({ title: 'Download Error', message: 'Error retrieving chunks', error: err.errmsg });
                }
                if (!chunks || chunks.length === 0) {
                    //No data found
                    res.status(404).json({ title: 'Download Error', message: 'No data found' });
                }

                const dataToJson = await createStream(docs[0]._id,bucketName )

                res.status(200).json({ data: dataToJson })
            })
        }
    })
    }


module.exports = {domainupload, brandupload, readData }