
const app = require("./app");
const config = require("./config/config")




// Connecting to server 

app.listen(config.port, () => {
    try {
        console.log("Listening on port :: ", config.port);
    }
    catch (err) {
        throw new Error("Cannot connect to the server")
    }
}
)





