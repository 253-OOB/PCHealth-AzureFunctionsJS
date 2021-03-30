
const dotenv = require("dotenv").config({path:__dirname+'/./../.env'}); // testing only
const helpers = require("../helpers/generateToken")

module.exports = async function (context, req) {

    context.res = generateRefreshToken( req );

}


function generateRefreshToken( req ) {

    try {

        console.log(req)

        if ( req.body != null && "payload" in req.body && typeof req.body["payload"] === "string"  ) {

            const signParameters = {
                Payload: req.body.payload, 
                TokenKey: process.env.REFRESH_TOKEN_PRIVATE_KEY,
                Options: {
                    algorithm: process.env.ALGORITHM
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

/*function generateRefreshToken( req ) {

    try {

        if ( req.body != null && "payload" in req.body && typeof req.body["payload"] === "string"  ) {

            const refreshToken = jwt.sign( { payload:  req.body["payload"] }, process.env.REFRESH_TOKEN_PRIVATE_KEY, refreshSignOptions );

            return {
                status: 200,
                // headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken: refreshToken })
            };

        } else {

            return {status: 400};

        }

    } catch (err) {

        // console.error(err);
        return {status: 500};

    }

}*/