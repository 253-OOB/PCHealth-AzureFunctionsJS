
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv").config({path:__dirname+'/./../.env'});
const generateToken = require("../helpers/generateToken");

module.exports.evaluateAuthentication = async (accessToken, refreshToken) => {

    if (accessToken !== null) {

        let jwtContent = this.verifyAccessToken(accessToken);

        if( jwtContent === 200 ) {

            return {
                status: 200,
                payload: jwtContent.payload
            }

        } else if( jwtContent === 401 ) {

            if( refreshToken !== null ) {

                let res = await generateToken.generateAccessToken( refreshToken )

                if( res.status === 200 ) {
                    
                    let accessToken = res.accessToken;
                    let payload = jwt.decode(accessToken);

                    return {
                        status: 200,
                        accessToken: accessToken,
                        payload: payload
                    }


                } else {
                    return {status: res.status};
                }

            } else {

                return {status: 401};

            }

        } else {

            return {status: jwtContent.status};

        }

    } else if( refreshToken !== null ) {

        let res = await generateToken.generateAccessToken( refreshToken )

        if( res.status === 200 ) {
            
            let accessToken = res.accessToken;
            let payload = jwt.decode(accessToken);

            return {
                status: 200,
                accessToken: accessToken,
                payload: payload
            }


        } else {
            return {status: res.status};
        }

    } else {

        return {status: 401};

    }

};

module.exports.verifyAccessToken = (accessToken) => {

    const publicKey = process.env.REFRESH_TOKEN_PUBLIC_KEY
    const options = {

        expiresIn: process.env.SHELFLIFE,
        algorithms: [process.env.ALGORITHM]

    }

    try {

        const payload = jwt.verify( accessToken, publicKey, options ).payload;

        return {
            status: 200,
            payload: payload
        };

    } catch (error) {

        if ( error.name === "TokenExpiredError" ) {

            return {status: 401};

        } if (error.name === "JsonWebTokenError" || error.name === "NotBeforeError") {
            
            return {status: 403};

        } else {

            return {status: 500};
        
        }

    }


};