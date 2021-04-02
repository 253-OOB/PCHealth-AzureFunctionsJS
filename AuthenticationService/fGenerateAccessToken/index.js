

const dotenv = require("dotenv").config({path:__dirname+'/./../.env'}); // testing
const helpers = require("../helpers/generateToken")

module.exports = async function (context, req) {

    context.res = await generateAccessToken( req );

}

async function generateAccessToken( req ) {

    try {

        const signParameters = {

            TokenKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
            Options: {
                expiresIn: process.env.SHELFLIFE,
                algorithm: process.env.ALGORITHM
            }
    
        }
    
        const verificationParameters = {
    
            Token: req.body.refreshToken,
            TokenKey: process.env.REFRESH_TOKEN_PUBLIC_KEY,
            Options: {
                algorithms: [process.env.ALGORITHM]
            }
    
        }

        return helpers.generateToken(signParameters, verify=true, verification=verificationParameters)

    } catch (error) {

        return {status: 500}

    }

}


// async function generateAccessToken( req ) {

//     try {

//         const refreshToken = req.body.refreshToken;

//         const verToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PUBLIC_KEY, refreshVerifyOptions);

//         const accessToken = jwt.sign( {payload: verToken.payload}, process.env.ACCESS_TOKEN_PRIVATE_KEY, accessSignOptions );

//         return {
//             status: 200,
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ accessToken: accessToken })
//         };

//     } catch (error) {

//         return {status: 403};

//     }

// }