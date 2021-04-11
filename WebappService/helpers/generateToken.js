
module.exports.generateInitialisationToken = async ( payload ) => {

    try {

        const refreshTokenPayload = {
            payload: payload
        }

        const getToken = await fetch (
            "http://localhost:7072/api/fGenerateInitialisationToken", 
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