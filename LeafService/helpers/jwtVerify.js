
const dotenv = require("dotenv").config({path:__dirname+'/./../.env'});
const jwt = require("jsonwebtoken");

/**
 * @function Method that verifies the validity of an initialisation token.
 * 
 * @param {string} initialisationToken 
 * A string representing the initialisation token of a leaf.
 * 
 * @returns {Promise<{status: int, payload: string}>} An object containing that status of the operation as well as an optional payload (present when status = 200)
 */
module.exports.verifyInitialisationToken = (initialisationToken) => {

    const publicKey = process.env.LEAF_CREATION_TOKEN_PUBLIC_KEY
    const options = {

        expiresIn: process.env.LEAF_CREATION_TOKEN_SHELFLIFE,
        algorithms: [process.env.LEAF_CREATION_TOKEN_ALGORITHM]

    }

    try {

        const payload = jwt.verify( initialisationToken, publicKey, options ).payload;
        return {
            status: 200,
            payload: payload
        };

    } catch (error) {

        // TODO Token expired error is not caught here.
        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError" || error.name === "NotBeforeError") {
            
            return {status: 403};

        } else {

            return {status: 500};
        
        }

    }


};


module.exports.verifyLeafToken = (leafToken) => {

    const publicKey = process.env.REFRESH_TOKEN_PUBLIC_KEY
    
    const options = {

        algorithms: [process.env.ALGORITHM]

    }

    try {

        const payload = jwt.verify( leafToken, publicKey, options ).payload;

        return {
            status: 200,
            payload: payload
        };

    } catch (error) {

        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError" || error.name === "NotBeforeError") {
            
            return {
                status: 403
            };

        } else {

            return {
                status: 500
            };
        
        }

    }


};

