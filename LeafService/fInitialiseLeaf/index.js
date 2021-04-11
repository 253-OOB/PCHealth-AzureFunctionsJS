


const sql = require("../helpers/sqlConfig");
const jwtVerify = require("../helpers/jwtVerify");
const jwtAuthenticate = require("../helpers/jwtAuthenticate");

const fetch = require("node-fetch");

module.exports = async function (context, req) {
 
    let configurationBlob = undefined;

    if (context.bindings.configurationBlob != null) {
        configurationBlob = context.bindings.configurationBlob;
    } else { 
        configurationBlob = context.bindings.defaultConfigBlob;
    }

    const resp= await initialiseLeaf(req, configurationBlob);

    context.res = resp;

}

/**
 * @function Function that integrates all the necessary steps to initialize a new leaf.
 * @param {Object} req The request given by azure function.
 * @param {Object} configurationBlob The configuration blob that was requested.
 * @returns {Promise<{status: int}>} A promise of a json object containing the status of the operation.
 */
async function initialiseLeaf( req, configurationBlob ) {

    try {

        const initialisationTokenPresent = ("InitialisationToken" in req.body) && typeof (req.body["InitialisationToken"] === "string");
        const computerNamePresent =  "ComputerName" in req.body && typeof req.body["ComputerName"] === "string";

        if ( req.body != null && initialisationTokenPresent && computerNamePresent ) {

            const verification = await jwtVerify.verifyInitialisationToken( req.body.InitialisationToken );

            if (verification.status === 200) {

                const refreshTokenCreation = await generateRefreshToken( verification.payload );

                if (refreshTokenCreation.status === 200) {

                    const dbInsertOperation = await registerLeafInDB(req.body["ComputerName"], refreshTokenCreation.refreshToken, verification.payload);

                    if (dbInsertOperation.status === 200) {

                        res = {

                            status: 200,

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: {

                                RefreshToken: refreshTokenCreation.refreshToken,
                                Configuration: JSON.stringify(configurationBlob)

                            }

                        };

                        return res

                    } else {

                        console.log("dbInsertOperation")
                        return {status: dbInsertOperation.status};

                    }

                } else {

                    return {status: refreshTokenCreation.status};

                }

            } else {
                
                return {status: verification.status};

            }

        } else {
            
            return {status: 400};

        }

    } catch (error) {
        
        return {status: 500};

    }


}

async function generateRefreshToken( payload ) {

    const newRefreshToken = await fetch (
        process.env.AUTH_URL + "fGenerateRefreshToken", 
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({payload: payload})
        }
    )

    // TODO Check for status code errors
    const data = await newRefreshToken.json();

    return {
        status: newRefreshToken.status,
        refreshToken: data.token
    };

}

async function registerLeafInDB(ComputerName, LeafToken, OrganisationEmail) {

    try {

        console.log("HERE");

        inputs = [
            {
                name: "ComputerName",
                type: sql.NVarChar,
                value: ComputerName
            },
            {
                name: "LeafToken",
                type: sql.NVarChar,
                value: LeafToken
            },
            {
                name: "OrganisationEmail",
                type: sql.NVarChar,
                value: OrganisationEmail
            }
        ]

        sql_results = await sql.query("INSERT INTO proj09.Leaf (ComputerName, AssignedName, LeafToken, OrganisationID) SELECT @ComputerName, @ComputerName, @LeafToken, t1.OrganisationID FROM proj09.Organisation as t1 WHERE t1.Email = @OrganisationEmail", inputs);

        return sql_results;
    
    } catch (error) {

        console.log(error);
        return {status: 500}

    }


}

