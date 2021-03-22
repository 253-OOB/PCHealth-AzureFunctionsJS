
const sql = require('mssql');
const jwt = require('jsonwebtoken');

const dotenv = require("dotenv").config({path:__dirname+'/./../.env'}); // testing


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

    try {

        const refreshToken = req.body.refreshToken;

        const verToken = jwt.verify(refreshToken, REFRESH_TOKEN_PUBLIC_KEY, refreshSignOptions);

        const accessToken = jwt.sign( {payload: verToken.payload}, ACCESS_TOKEN_PRIVATE_KEY, accessSignOptions );

        return {
            status: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accessToken: accessToken })
        };

    } catch (error) {

        return {status: 403};

    }

}