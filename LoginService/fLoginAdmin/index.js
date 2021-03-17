
const sql = require("mssql");
const bcrypt = require("bcrypt");
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");

// const dotenv = require("dotenv").config();
const dotenv = require("dotenv").config({path:__dirname+'/./../.env'}); // testing only


const SQL_SERVER=process.env.SQL_SERVER;
const SQL_USER=process.env.SQL_USER;
const SQL_PASS=process.env.SQL_PASS;
const SQL_DATABASE=process.env.SQL_DATABASE;
const SQL_ENCRYPT = process.env.SQL_ENCRYPT === "true";

module.exports = async function (context, req) {

    context.res = await Login( context, req );

}

async function Login( context, req ) {

    const signInInfo = await getSignInInfo( req );

    if ( signInInfo.status == 200 ) {

        const data = signInInfo.sql_resp;

        if ( data.recordset.length > 0 ) {

            const isCorrectCredentials = bcrypt.compare(req.body.password, data.recordset[0].Password);

            if (isCorrectCredentials == true) {
                
                // If the user does not have a refresh token generate one.

                const getRefreshToken = {
                    status: 200, // Preliminary value in case the token already exists
                    refreshToken: data.recordset[0].RefreshToken
                };

                if( getRefreshToken.refreshToken == null ) {

                    getRefreshToken = await generateRefreshToken( data.recordset[0].Organization + "." + data.recordset[0].Username );

                }

                if( getRefreshToken.status == 200 ) {

                    // No need to check this statement as it is an insert, and if it is not correctly inputed in the DB then the user will just need to sign in again after the access token expires.
                    addNewRefreshTokenToDB(data.recordset[0].Email, getRefreshToken.RefreshToken);

                    // Generate an access token
                    const getAccessToken = await generateAccessToken( {headers: getRefreshToken.refreshToken} );

                    if ( getAccessToken.status == 200 ) {

                        const json_bdy = {
                            accessToken: getAccessToken.accessToken,
                            refreshToken: getRefreshToken.refreshToken
                        }

                        return {
                            status: 200,
                            headers: { "Content-Type": "application/json" },
                            json: json_body,
                            isRaw: true
                        }

                    } else {

                        return {status: 500};

                    }

                    

                } else {

                    return { status: refreshToken.status};

                }

            } else {
                return {status: 403};
            }

        } else {

            return {status: 403};

        }

    } else {

        return {status: signInInfo.status};

    }

}

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


async function getSignInInfo( req ) {

    let sql_response = undefined;

    try {

        if ("query" in req) {

            if ( typeof req.query === typeof {} && "Email" in req.query && typeof req.query["Email"] === "string" ) {
                
                const pool = await sql.connect(config);

                const request = pool.request();

                // TODO Change Refresh token name in database from Refresh_Token to RefreshToken


                sql_response = await request.input('Email', sql.NVarChar, req.query["Email"])
                                            .query("SELECT t1.Password, t2.Name as OrganisationName, t1.Username, t1.Refresh_Token as RefreshToken FROM dbo.Accounts as t1 INNER JOIN dbo.Organisations as t2 ON t1.OrganisationID = t2.OrganisationID WHERE t1.Email=@Email");

                pool.close();

            } else if ( typeof req.query === typeof {} && "Username" in req.query && "Organisation" in req.query && ( typeof req.query["Username"] === "string" && typeof req.query["Organisation"] === "string" ) ) {

                const pool = await sql.connect(config);

                const request = pool.request();
                
                // TODO Change Refresh token name in database from Refresh_Token to RefreshToken

                sql_response = await request.input("Organisation", sql.NVarChar, req.query["Organisation"])
                                            .input("Username", sql.NVarChar, req.query["Username"])
                                            .query("SELECT t1.Password, t2.Name as OrganisationName, t1.Username, t1.Refresh_Token as RefreshToken FROM dbo.Accounts as t1 INNER JOIN dbo.Organisations as t2 ON t1.OrganisationID = t2.OrganisationID WHERE t1.Username=@Username AND t2.Name=@Organisation");

                pool.close();

            } else {

                return {status: 400};

            }
        } else {

            return {status: 400};

        }

        console.log("Please verify the content of the sql_response.")
        console.log(sql_response);

        return {
            status: 200,
            sql_resp: sql_response
        }

    } catch (err) {

        // Non-checkable errors are possible, testing will mostly not verify the full extent this catch statement.

        console.log(err);
        return {status: 500};
        
    }

}


async function addNewRefreshTokenToDB ( email, refreshToken ) {

    /*
     * This function does not need to be unit tested.
     * It has no function output, and if it fails would not affect drastically the rest of the application.
     * If this function executes, then its inputs are also correct, couretsy of the tests covering the functions executing before it.
     * The database update has been tested, and it works.
    */

    try {
            
        const pool = await sql.connect(config);

        const request = pool.request();

        // TODO Change Refresh token name in database from Refresh_Token to RefreshToken

        sql_response = await request.input("Email", sql.NVarChar, email)
                                    .input("RefreshToken", sql.NVarChar, refreshToken)
                                    .query("UPDATE dbo.Accounts SET Refresh_Token=@RefreshToken WHERE Email=@Email");

        pool.close();

    } catch (err) {

        console.log(err);

    }

}


async function generateRefreshToken( payload ) {

    const resp = async () => {

        try {

            const getToken = await fetch (
                process.env.AUTH_URL + "fGenerateRefreshToken", 
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    json: payload,
                    isRaw: true
                }
            )

            if( getToken.status == 200 ) {

                return {
                    status: 200,
                    token: getToken.json.accessToken
                }

            } else {

                return { status: getToken.status };

            }

        } catch (err) {

            console.log(err);
            return { status: 500 }

        }

    };

}

async function generateAccessToken( req ) {

    const resp = async () => {

        try {

            const getToken = await fetch (
                process.env.AUTH_URL + "fGenerateAccessToken", 
                {
                    method: "POST",
                    headers: req.headers
                }
            )

            if( getToken.status == 200 ) {

                return {
                    status: 200,
                    accressToken: getToken.json.accessToken
                }

            } else {

                return { status: getToken.status };

            }

        } catch (err) {

            console.log(err);
            return { status: 500 }

        }

    };

    return resp;

}

async function verifyAccessToken( req ) {
    
    const authHeader = req.headers['authorization'];
    
    const token = authHeader && authHeader.split(' ')[1];
    
    const signOptions = {
        expiresIn: process.env.SHELFLIFE,
        algorithm: process.env.ALGORITHM
    }

    if(token == null) {
    
        return 401;
            
    } else {
    
        try {
            
            jwt.verify(token, process.env.ACCESS_TOKEN_PUBLIC_KEY, signOptions);
            return 204;

        } catch (error) {
            return 403;
        }
    
    }

}


