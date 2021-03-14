
const jwt = require("jsonwebtoken");

module.exports = async function (context, req) {
    
    const refreshToken = jwt.sign( 
        {
            user: req.body.OrganizationName + "." + req.body.Username
        }, 
        process.env.REFRESH_TOKEN_SECRET
    );

    context.res = {
        status: 200,
        body : {
            refreshToken: refreshToken
        },
        isRaw: true
    };

}