
const fetch = require("node-fetch");

module.exports.generateInitialisationToken = async ( payload ) => {

    try {

        const refreshTokenPayload = {
            payload: payload
        }

        const getToken = await fetch (
            process.env.AUTH_URL + "fGenerateInitialisationToken", 
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(refreshTokenPayload)
            }
        )

        if( getToken.status == 200 ) {

            const refreshToken = await getToken.json();

            return {
                status: 200,
                InitialisationToken: refreshToken["token"]
            };

        } else {
            return {status: getToken.status};
        }

    } catch (err) {

        return { status: 500 }

    }


};

module.exports.generateAccessToken = async ( refreshToken ) => {
    
    try {

        bodyContent = {
            "refreshToken": refreshToken
        };

        const getToken = await fetch(
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