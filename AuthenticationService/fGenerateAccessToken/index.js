
const jwt = require('jsonwebtoken');

module.exports = async function (context, req) {
  
    const refreshToken = req.body.refreshToken;

    if( refreshToken == null ) {
        context.res.status = 401;
    }

}

function generateAccessToken( payload ) {

    const accessToken = jwt.sign(
        payload.OrganizationName + "." + payload.Username, 
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '15min'
        }
    );
    
    context.res = {
        status: 200,
        body : {
            refreshToken: refreshToken
        },
        isRaw: true
    };

}