

const jwt = require("jsonwebtoken");

// const dotenv = require("dotenv").config();
const dotenv = require("dotenv").config({path:__dirname+'/./../.env'}); // testing only


module.exports = async function (context, req) {

    context.res = generateRefreshToken(context, req);

}

function generateRefreshToken(context, req) {

    try {

        const body = req.body;

        // TODO: (Issue #15) add additional checks on payload.
        if ( !("payload" in body) ) {
            throw new Error("Payload attribute not found.")
        }

        const refreshToken = jwt.sign( 
            {
                payload:  body["payload"]
            },
            process.env.REFRESH_TOKEN_SECRET
        );

        return {
            status: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: refreshToken })
        };

    } catch (err) {

        // TODO: (Issue #3) this error should not always be 500.

        console.error(err);

        context.res.status = 500;

        return context.res;

    }

}