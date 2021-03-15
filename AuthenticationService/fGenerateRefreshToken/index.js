
const jwt = require("jsonwebtoken");

module.exports = async function (context, req) {
    
    const refreshToken = jwt.sign( 
        {
            payload: req.json.payload
        }, 
        process.env.REFRESH_TOKEN_SECRET
    );

    context.res = {
        status: 200,
        headers: { "Content-Type": "application/json" },
        json : {
            refreshToken: refreshToken
        },
        isRaw: true
    };

}