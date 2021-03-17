
const sql = require('mssql');
const jwt = require('jsonwebtoken');


// const dotenenv = require('dotenv').login();
const dotenv = require("dotenv").config({path:__dirname+'/./../.env'}); // testing

// TODO: (Issue #2) Migrate from Symmetric to Asymmetric Key (Public Private) (https://siddharthac6.medium.com/json-web-token-jwt-the-right-way-of-implementing-with-node-js-65b8915d550e)


module.exports = async function (context, req) {

    context.res = await generateAccessToken( req );

}

async function generateAccessToken( req ) {


    try {

        if( req.body != null && "refreshToken" in req.body && typeof req.body["refreshToken"] === "string" ) {

            const refreshToken = req.body.refreshToken;

            const sql_resp = await verifyRefreshToken( refreshToken );

            if ( sql_resp.success == true ) {
                
                if( sql_resp.resp.recordset.length !== 0 ) {

                    const verToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

                    if (verToken == null) {
        
                        return {status: 403};

                    } else {

                        const accessToken = jwt.sign( {payload: verToken.payload}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15min"} );

                        return {
                            status: 200,
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ accessToken: accessToken })
                        };

                    }
                

                } else {

                    return { status: 403 };

                }

            } else {

                return {status: 500};
            
            } 

        } else {

            return {status: 400};

        }

    } catch (error) {

        console.error(error);
        return {status: 500};

    }

}

const SQL_SERVER=process.env.SQL_SERVER;
const SQL_USER=process.env.SQL_USER;
const SQL_PASS=process.env.SQL_PASS;
const SQL_DATABASE=process.env.SQL_DATABASE;
const SQL_ENCRYPT = process.env.SQL_ENCRYPT === "true";


async function verifyRefreshToken( refreshToken ) {

    try {

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
        };

        const pool = await sql.connect(config);

        const request = pool.request();

        // TODO: Change the name of Refresh_Token to RefreshToken in database.
        const sql_response = await request.input('RefreshToken', sql.NVarChar, refreshToken)
                                          .query("SELECT Refresh_Token FROM dbo.Accounts WHERE Refresh_Token=@RefreshToken");

        pool.close();

        return {success: true, resp: sql_response};

    } catch (error) {

        console.log("Could not connect to the database.");
        console.log(error);
        return { success: false };

    }


}