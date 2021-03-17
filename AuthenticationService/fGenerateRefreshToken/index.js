

const jwt = require("jsonwebtoken");

// const dotenv = require("dotenv").config();
const dotenv = require("dotenv").config({path:__dirname+'/./../.env'}); // testing only


module.exports = async function (context, req) {

    context.res = generateRefreshToken( req );

}

function generateRefreshToken( req ) {

    try {

        // TODO: (Issue #15) add additional checks on payload.
        if ( req.body != null && "payload" in req.body && typeof req.body["payload"] === "string"  ) {

            const refreshToken = jwt.sign( 
                {
                    payload:  req.body["payload"]
                },
                process.env.REFRESH_TOKEN_SECRET
            );
    
            return {
                status: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken: refreshToken })
            };

        } else {

            console.log(req);
            return {status: 400};

        }

        

    } catch (err) {

        // TODO: (Issue #3) this error should not always be 500.
        console.log(err);
        return {status: 500};

    }

}