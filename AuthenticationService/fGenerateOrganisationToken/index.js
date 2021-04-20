
const dotenv = require("dotenv").config({path:__dirname+'/./../.env'}); // testing only
const helpers = require("../helpers/generateToken")

module.exports = async function (context, req) {

    context.res = generateOrganisationToken( req );

}


function generateOrganisationToken( req ) {

    try {

        console.log(req)

        if ( req.body != null && "payload" in req.body && typeof req.body["payload"] === "string"  ) {

            const signParameters = {
                Payload: req.body.payload, 
                TokenKey: process.env.REFRESH_TOKEN_PRIVATE_KEY,
                Options: {
                    algorithm: process.env.ALGORITHM,
                    expiresIn: process.env.SHELFLIFE
                }
            };

            return helpers.generateToken(signParameters);

        } else {

            return {status: 400}

        }

    } catch (error) {
        console.log(error)
        return {status: 500}

    } 

}

