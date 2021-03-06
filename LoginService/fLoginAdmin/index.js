
const sql = require("mssql");
const bcrypt = require("bcryptjs");
const fetch = require("node-fetch");

// const dotenv = require("dotenv").config();
const dotenv = require("dotenv").config({path:__dirname+'/./../.env'}); // testing only

module.exports = async function (context, req) {

    context.res = await Login( req );

}

async function Login( req ) {

    const signInInfo = await getSignInInfo( req );

    if ( signInInfo.status == 200 ) {

        const data = signInInfo.sql_resp;

        if ( data.recordset.length == 1 ) {

            if( "Password" in req.query && typeof req.query["Password"] === "string" ) {

                const isCorrectCredentials = await bcrypt.compare(req.query.Password, data.recordset[0].Password);

                if (isCorrectCredentials == true) {

                    let getRefreshToken = {
                        status: 200, // Preliminary value in case the token already exists
                        refreshToken: data.recordset[0].RefreshToken
                    };

                    // If the user does not have a refresh token generate one.

                    if( getRefreshToken.refreshToken == null ) {

                        const payload = data.recordset[0].Email;
                        getRefreshToken = await generateRefreshToken( payload );

                    }

                    if( getRefreshToken.status == 200 ) {

                        // No need to check this statement as it is an insert, and if it is not correctly inputed in the DB then the user will just need to sign in again after the access token expires.
                        addNewRefreshTokenToDB(data.recordset[0].Email, getRefreshToken.refreshToken);

                        // Generate an access token
                        const getAccessToken = await generateAccessToken(getRefreshToken.refreshToken);

                        if ( getAccessToken.status == 200 ) {

                            const json_body = {
                                accessToken: getAccessToken.accessToken,
                                refreshToken: getRefreshToken.refreshToken
                            }

                            return {
                                status: 200,
                                headers: { "Content-Type": "application/json" },
                                body: json_body
                            }

                        } else {

                            // context.log(5);
                            return {status: getAccessToken.status};

                        }

                        

                    } else {

                        // context.log(4);
                        return { status: getRefreshToken.status};

                    }

                } else {

                    // console.log(3);
                    return {status: 403};

                }

            } else {

                // context.log(2);
                return {status: 400};

            }

        } else {

            // context.log(1);
            return {status: 400};

        }

    } else {

        // context.log(0)
        return {status: signInInfo.status};

    }

}

const SQL_SERVER=process.env.SQL_SERVER;
const SQL_USER=process.env.SQL_USER;
const SQL_PASS=process.env.SQL_PASS;
const SQL_DATABASE=process.env.SQL_DATABASE;
const SQL_ENCRYPT=process.env.SQL_ENCRYPT === "true";

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

                sql_response = await request.input('Email', sql.NVarChar, req.query["Email"])
                                            .query("SELECT t1.Password, t1.Email, t1.Username, t1.RefreshToken FROM proj09.Accounts as t1 WHERE t1.Email=@Email");

                pool.close();

            } else if ( typeof req.query === typeof {} && "Username" in req.query && typeof req.query["Username"] === "string" ) {

                const pool = await sql.connect(config);

                const request = pool.request();

                sql_response = await request.input("Username", sql.NVarChar, req.query["Username"])
                                            .query("SELECT t1.Password, t1.Email, t1.Username, t1.RefreshToken FROM proj09.Accounts as t1 WHERE t1.Username=@Username");

                pool.close();

            } else {
                
                return {status: 400};

            }
        } else {

            return {status: 400};

        }

        // console.log("Please verify the content of the sql_response.")
        // console.log(sql_response);

        return {
            status: 200,
            sql_resp: sql_response
        }

    } catch (err) {

        // Non-checkable errors are possible, testing will mostly not verify the full extent this catch statement.

        // context.log(err);
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

        sql_response = await request.input("Email", sql.NVarChar, email)
                                    .input("RefreshToken", sql.NVarChar, refreshToken)
                                    .query("UPDATE proj09.Accounts SET RefreshToken=@RefreshToken WHERE Email=@Email");

        pool.close();

    } catch (err) {

        // context.log(err);

    }

}


async function generateRefreshToken( payload ) {

    try {

        const refreshTokenPayload = {
            payload: payload
        }

        const getToken = await fetch (
            process.env.AUTH_URL + "fGenerateRefreshToken", 
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(refreshTokenPayload)
            }
        )

        if( getToken.status == 200 ) {

            const refreshToken = await getToken.json();

            return {
                status: 200,
                refreshToken: refreshToken["token"]
            };

        } else {
            return {status: getToken.status};
        }

    } catch (err) {

        return { status: 500 }

    }


}

async function generateAccessToken( refreshToken ) {

    try {

        bodyContent = {
            "refreshToken": refreshToken
        };

        const getToken = await fetch (
            process.env.AUTH_URL + "fGenerateAccessToken", 
            {
                method: "POST",
                body: JSON.stringify(bodyContent)
            }
        )

        if( getToken.status == 200 ) {

            const accessToken = await getToken.json();

            return {
                status: 200,
                accessToken: accessToken["token"]
            };

        } else {

            return {status: getToken.status};

        }

    } catch (err) {

        return { status: 500 }

    }

}

/*

TEMPLATE FUNCTION TO VERIFY ACCESS TOKEN (NOT USED IN THIS FUNCTION)

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
*/

