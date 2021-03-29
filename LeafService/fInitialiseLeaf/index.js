


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

    context.res = initialiseLeaf(req, configurationBlob);

}

/**
 * @function Function that integrates all the necessary steps to initialize a new leaf.
 * @param {Object} req The request given by azure function.
 * @param {Object} configurationBlob The configuration blob that was requested.
 * @returns {Promise<{status: int}>} A promise of a json object containing the status of the operation.
 */
async function initialiseLeaf( req, configurationBlob ) {

    try {

        const initialisationTokenPresent = "InitialisationToken" in req.body && typeof req.body["InitialisationToken"] === "string";
        const computerNamePresent =  "ComputerName" in req.body && typeof req.body["ComputerName"] === "string";

        if ( req.body != null && initialisationTokenPresent && computerNamePresent ) {

            const verfication = await jwtVerify.verifyInitialisationToken( req.body.InitialisationToken );

            if (verification === 200) {
                
                const refreshTokenCreation = await generateRefreshToken( verification.payload );

                if (refreshTokenCreation.status === 200) {

                    const dbInsertOperation = registerLeafInDB(req.body["ComputerName"], refreshTokenCreation.refreshToken, verification.payload);

                    if (dbInsertOperation.status === 200) {

                        return {

                            status: 200,

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: {

                                RefreshToken: refreshTokenCreation.refreshToken,
                                AccessToken: accessTokenCreation.accessToken,
                                Configuration: configurationBlob

                            }

                        };

                    } else {

                        return {status: dbInsertOperation.status};

                    }

                } else {

                    return {status: refreshTokenCreation.status};

                }

            } else {

                return {status: verfication.status};

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
            body: payload
        }
    )

    return newRefreshToken;

}

async function registerLeafInDB(ComputerName, LeafToken, OrganisationEmail) {


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

    sql_results = await sql.query("INSERT INTO Leaf (ComputerName, AssignedName, LeafToken, OrganisationID) SELECT @ComputerName, @ComputerName, @LeadToken, t1.OrganisationID as t1 FROM Organisation WHERE t1.Email = @OrganisationEmail", inputs);

    return sql_results;


}

