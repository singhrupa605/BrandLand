const dotenv = require("dotenv");
const Joi = require("joi");
const path = require('path');



// Setting path for environment variables
dotenv.config({path:path.join(__dirname, '../../.env')});


// Defining joi validation schema for environment variables
const envVarSchema = Joi.object().keys({
    PORT : Joi.number().default(8080),
    MONGO_URI : Joi.string().required().description("MONGO DB URL"),
    MONGO:Joi.string().required()

}).unknown();
 
const {value : vars , error} = envVarSchema.prefs({errors : {label:"key"}}).validate(process.env);

if(error)
{
    throw new Error(error.message);
}


module.exports = 
{
    port : vars.PORT,
    mongoose  : {
        url : vars.MONGO_URI,
        options : 
        {
            useNewUrlParser : true,
            useUnifiedTopology : true,
        },
        mongourl : vars.MONGO

    }

}


