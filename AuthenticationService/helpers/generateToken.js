
const jwt = require("jsonwebtoken");

module.exports.generateToken = (signParameters, verify=false, verification = undefined ) => {

    try {

        if (verify === true) {

            const verificationToken = verification.Token;
            const verificationTokenKey = verification.TokenKey;
            const verificationOptions = verification.Options;

            signParameters.Payload = jwt.verify(verificationToken, verificationTokenKey, verificationOptions);

        }

        const signPayload = signParameters.Payload;
        const signTokenKey = signParameters.TokenKey;
        const signOptions = signParameters.Options;

        const newToken = jwt.sign( {payload: signPayload}, signTokenKey, signOptions );

        return {

            status: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: newToken })

        };

    } catch (error) {

        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError" || error.name === "NotBeforeError") {

            return {status: 403};

        } else {

            return {status: 500};

        }

    }

}