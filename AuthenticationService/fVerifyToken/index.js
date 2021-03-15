
const jwt = require('jsonwebtoken')
const dotenv = require("dotenv").config(); 

module.exports = async function (context, req) {
    
    context.log(req);

    const authHeader = req.headers['authorization'];
    
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) {

        context.res.status = 401;
            
    } else {

        context.res.status = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return 403;
            } else {
                return 204;
            }
        });

    }

}

