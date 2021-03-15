

const jwt = require("jsonwebtoken");

module.exports = async function (context, req) {

    try {

        const body = req.body;

        if ( !("payload" in body) ) {
            throw new Error("Payload attribute not found.")
        }

        const refreshToken = jwt.sign( 
            {
                payload:  body["payload"]
            }, 
            process.env.REFRESH_TOKEN_SECRET
        );

        context.res = {
            status: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: refreshToken })
        };

    } catch (err) {

        // TODO: (Issue #3) this error should not always be 500.

        console.error(err);
        context.res.status = 500;

    }

}