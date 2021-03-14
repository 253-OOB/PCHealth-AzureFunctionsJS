
const sql = require("mssql");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
const fetch = require("node-fetch");

const SQL_SERVER=process.env.SQL_SERVER;
const SQL_USER=process.env.SQL_USER;
const SQL_PASS=process.env.SQL_PASS;
const SQL_DATABASE=process.env.SQL_DATABASE;
const SQL_ENCRYPT = process.env.SQL_ENCRYPT === "true";

module.exports = async function (context, req) {

    const isAccessTokenAvailable = await verifyAccessToken(req);

    if( isAccessTokenAvailable == 204 ) {

        // TODO: redirect to website.

    } else {

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

        var sql_response = undefined

        try {

            if ("Email" in req.query) {
                
                const pool = await sql.connect(config);

                const request = pool.request();

                sql_response = await request.input('Email', sql.NVarChar, req.query["Email"])
                                            .query("SELECT t1.Password, t2.Name as OrganisationName, t1.Username, t1.RefreshToken FROM dbo.Accounts as t1 INNER JOIN dbo.Organizations as t2 ON t1.OrganisationID = t2.OrganisationID WHERE t1.Email=@Email");

                pool.close();

            } else if ("Username" in req.query && "Organisation" in req.query) {

                const pool = await sql.connect(config);

                const request = pool.request();
                
                sql_response = await request.input("Organization", sql.NVarChar, req.query["Organization"])
                                            .input("Username", sql.NVarChar, req.query["Username"])
                                            .query("SELECT t1.Password, t2.Name as OrganisationName, t1.Username, t1.RefreshToken FROM dbo.Accounts as t1 INNER JOIN dbo.Organizations as t2 ON t1.OrganisationID = t2.OrganisationID WHERE t1.Username=@Username AND t2.Name=@Organisation");

                pool.close();

            } else {

                sql_response = undefined;

            }

        } catch (err) {

            context.log(err);
            
        }

        if (sql_response === undefined) {

            context.res.status = 500;
                            
        } else if (sql_response.rows.length() == 0) {
        
            context.res.status = 403;
        
        } else {
        
            const isCorrectCredentials = bcrypt.compare(req.body.password, sql_response.rows[0].Password);
            
            if ( isCorrectCredentials === true ) {
                context.log("TRUE");
            } else {
                context.log("FALSE");
            }

            

        }

    }

}

async function verifyAccessToken( req ) {

    const status = async () => {
        
        try {

            const verToken = await fetch ( 
                process.env.AUTH_URL + "fVerifyToken", 
                {
                    method: "POST",
                    headers: req.headers
                }
            )

            const status_code = await verToken.status;

            return status_code;

        } catch (err) {

            console.log(err);

        }

    }

    return await status();

}

async function generateAccessToken( req ) {

    const resp = async () => {
        
        try {

            const genToken = await fetch ( 
                process.env.AUTH_UR + "fGenerateAccessToken", 
                {
                    method: "POST",
                    headers: req.headers
                }
            )

            const status_code = await verToken.status;
            const 
            return status_code;

        } catch (err) {

            console.log(err);

        }

    }

}


