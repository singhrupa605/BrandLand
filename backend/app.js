const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const compression = require("compression");
const routes = require("./routes")

// to wrap URLs around https
app.use(helmet())

// middleware to accept post request body as a  json object  over the server
app.use(express.json({ extended: true, limit: '50mb' }))

// parse urlencoded request body
app.use(express.urlencoded({extended: true ,limit : '50mb', parameterLimit:100000}))

// gzip compression
app.use(compression());

//enable cors
app.use(cors());
app.options("*", cors());

// hanlde routes
app.use("/", routes);


// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new Error(404, "Not found"));
});


module.exports = app;