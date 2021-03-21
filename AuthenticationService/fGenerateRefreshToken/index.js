

const jwt = require("jsonwebtoken");

// const dotenv = require("dotenv").config();
const dotenv = require("dotenv").config({path:__dirname+'/./../.env'}); // testing only


module.exports = async function (context, req) {

    context.res = generateRefreshToken( req );

}

const REFRESH_TOKEN_PRIVATE_KEY = process.env.REFRESH_TOKEN_PRIVATE_KEY;

const refreshSignOptions = {
    algorithm: process.env.ALGORITHM
}

function generateRefreshToken( req ) {

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

}