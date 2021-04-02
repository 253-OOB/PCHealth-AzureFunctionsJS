
const dotenv = require("dotenv").config({path:__dirname+'/./../.env'});
const fetch = require("node-fetch");

module.exports.generateAccessToken = async ( refreshToken ) => {
    
    try {

        bodyContent = {
            "refreshToken": refreshToken
        };

        const getToken = await fetch (
            process.env.AUTH_URL + "fGenerateAccessToken", 
            {
                method: "POST",
                body: JSON.stringify(bodyContent)
            }
        )

        if( getToken.status == 200 ) {

            const accessToken = await getToken.json();

            return {
                status: 200,
                accessToken: accessToken["token"]
            };

        } else {

            return {status: getToken.status};

        }

    } catch (err) {

        // console.log(err);
        return { status: 500 }

    }

};