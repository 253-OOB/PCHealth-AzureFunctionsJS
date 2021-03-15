
const sql = require('mssql');
const jwt = require('jsonwebtoken');

const SQL_SERVER=process.env.SQL_SERVER;
const SQL_USER=process.env.SQL_USER;
const SQL_PASS=process.env.SQL_PASS;
const SQL_DATABASE=process.env.SQL_DATABASE;
const SQL_ENCRYPT = process.env.SQL_ENCRYPT === "true";

// TODO: (Issue #2) Migrate from Symmetric to Asymmetric Key (Public Private) (https://siddharthac6.medium.com/json-web-token-jwt-the-right-way-of-implementing-with-node-js-65b8915d550e)

module.exports = async function (context, req) {

    const refreshToken = req.body.refreshToken;

    if( refreshToken == null ) {

        context.res.status = 401;
    
    } else {

        const refreshTokenExists = await verifyRefreshToken( refreshToken );

        if ( refreshTokenExists == 0 ) {

            try {
            
                const verToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
                
                const accessToken = jwt.sign( {payload: verToken.payload}, process.env.ACCESS_TOKEN_SECRET );

                context.res = {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                    json: { accessToken: accessToken },
                    isRaw: true
                };
            
            } catch (err) {

                context.res.status = 403;

            } 
        

        } else if (refreshTokenExists == -1) {

            context.resp.status = 403;

        } else if (refreshTokenExists == -2) {

            context.resp.status = 500;
        
        } 

    }

}

async function verifyRefreshToken( refreshToken ) {

    const config = {
        server: SQL_SERVER,
        user: SQL_USER,
        password: SQL_PASS,
        database: SQL_DATABASE,
        options: {
            encrypt: SQL_ENCRYPT,
            trustedConnection: !SQL_ENCRYPT,
            enableArithAbort: true
        }
    }

    try {

        const pool = await sql.connect(config);

        const request = pool.request();

        const sql_response = await request
            .input('RefreshToken', sql.NVarChar, refreshToken)
            .query("SELECT RefreshToken FROM dbo.Accounts RefreshToken=@RefreshToken");

        pool.close();

        if(sql_response.rows.lenght() == 0) {
            return -1;
        } else {
            return 0;
        }

    } catch (error) {

        context.log("Could not connect to the database.");
        context.log(err);
        return -2;

    }


}