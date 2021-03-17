
const sql = require('mssql');
const jwt = require('jsonwebtoken');


// const dotenenv = require('dotenv').login();
const dotenv = require("dotenv").config({path:__dirname+'/./../.env'}); // testing

// TODO: (Issue #2) Migrate from Symmetric to Asymmetric Key (Public Private) (https://siddharthac6.medium.com/json-web-token-jwt-the-right-way-of-implementing-with-node-js-65b8915d550e)


module.exports = async function (context, req) {

    context.res = await generateAccessToken( req );

}


const REFRESH_TOKEN_PUBLIC_KEY = process.env.REFRESH_TOKEN_PUBLIC_KEY;

const refreshSignOptions = {
    algorithms: [process.env.ALGORITHM]
}

const ACCESS_TOKEN_PRIVATE_KEY = process.env.ACCESS_TOKEN_PRIVATE_KEY;

const accessSignOptions = {
    expiresIn: process.env.SHELFLIFE,
    algorithm: process.env.ALGORITHM
}

async function generateAccessToken( req ) {

    // TODO: (Issue #16) Add additional checks on content of refresh token.

    console.log(process.env.ALGORITHM);

    try {

        if( req.body != null && "refreshToken" in req.body && typeof req.body["refreshToken"] === "string" ) {

            const refreshToken = req.body.refreshToken;

            const verToken = jwt.verify(refreshToken, REFRESH_TOKEN_PUBLIC_KEY, refreshSignOptions);

            const accessToken = jwt.sign( {payload: verToken.payload}, ACCESS_TOKEN_PRIVATE_KEY, accessSignOptions );

            return {
                status: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accessToken: accessToken })
            };

        } else {

            return {status: 403};

        }

    } catch (error) {

        console.error(error);
        return {status: 500};

    }

}