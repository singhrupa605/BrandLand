
const app = require("./app");
const mongoose = require("mongoose");
const config = require("./config/config")


// Connecting mongoDB and server 

app.listen(config.port, () => {
    try {
        console.log("Listening on port :: ", config.port);
        mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => console.log("Connected to mongoDB"));

    }
    catch (err) {
        throw new Error("Cannot connect to the server")
    }
}
)


