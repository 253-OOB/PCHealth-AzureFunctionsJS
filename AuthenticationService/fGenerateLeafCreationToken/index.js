

const jwt = require("jsonwebtoken");

const dotenv = require("dotenv").config({path:__dirname+'/./../.env'});


module.exports = async function (context, req) {

    context.res = generateLeafCreationToken( req );

}


const refreshSignOptions = {
    algorithm: process.env.LEAF_CREATION_TOKEN_ALGORITHM,
    expiresIn: process.env.LEAF_CREATION_TOKEN_SHELF_LIFE
}

function generateLeafCreationToken( req ) {

    try {

        if ( req.body != null && "payload" in req.body && typeof req.body["payload"] === "string"  ) {

            const refreshToken = jwt.sign( { payload:  req.body["payload"] }, process.env.LEAF_CREATION_TOKEN_PRIVATE_KEY, refreshSignOptions );

            return {
                status: 200,
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