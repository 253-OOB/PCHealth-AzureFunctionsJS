
const sql = require("mssql");
const bcrypt = require("bcryptjs");
const fetch = require("node-fetch");


module.exports = async (context, req) => {

    context.res = Login(req);

}

async function Login( req ) {

    const signInInfo = await getSignInInfo( req );

    if ( signInInfo.status == 200 ) {

        const data = signInInfo.sql_resp;

        if ( data.recordset.length == 1 ) {

            if( "Password" in req.query && typeof req.query["Password"] === "string" ) {

                const isCorrectCredentials = await bcrypt.compare(req.query.Password, data.recordset[0].Password);

                if (isCorrectCredentials == true) {

                    const getOrganisationToken = await generateOrganisationToken( data.recordset[0].Email );

                    if( getOrganisationToken.status == 200 ) {

                        console.log("Hello");
            
                        return {
                            status: 200,
                            headers: { "Content-Type": "application/json" },
                            body: {

                                OrganisationToken: getOrganisationToken.organisationToken

                            }
                        }  

                    } else {

                        // context.log(4);
                        return { status: getOrganisationToken.status };

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
                                            .query("SELECT t1.Password, t1.Email, t1.Name FROM proj09.Organisation as t1 WHERE t1.Email=@Email");

                pool.close();

            } else {
                
                return {status: 400};

            }
        } else {

            return {status: 400};

        }

        return {
            status: 200,
            sql_resp: sql_response
        }

    } catch (err) {

        // context.log(err);
        return {status: 500};
        
    }

}


async function generateOrganisationToken( payload ) {

    try {

        const refreshTokenPayload = {
            payload: payload
        }

        const getToken = await fetch (
            process.env.AUTH_URL + "fGenerateOrganisationToken", 
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(refreshTokenPayload)
            }
        )

        if( getToken.status == 200 ) {

            const organisationToken = await getToken.json();

            return {
                status: 200,
                organisationToken: organisationToken["token"]
            };

        } else {

            return {status: getToken.status};

        }

    } catch (err) {

        return { status: 500 }

    }


}