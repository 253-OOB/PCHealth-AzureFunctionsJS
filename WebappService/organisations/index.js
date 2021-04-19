
const jwtVerify = require("../helpers/jwtVerify");
const sql = require("../helpers/sqlConfig");

module.exports = async function (context, req) {
    
    context.res = await getOrganisations(req);

}

async function getOrganisations(req) {

    // Verify authentication

    let auth = await verifyJwtIdentity( req );

    if( auth.status !== 200 ) {
        return {status: auth.status};
    }

    let Email = auth.payload.payload;

    // Get list of organisations

    let inputs = [{name: "Email", type: sql.NVarChar, value: Email}]; 
    let getOrganisationQueryString = "SELECT OrganisationID, OrganisationName FROM proj09.Accounts_Organisations_V WHERE AccountEmail=@Email";

    let sqlQuery = await sql.query(getOrganisationQueryString, inputs);
    
    console.log(auth)

    if( sqlQuery.status == 200 ) {

        return {

            status: 200,
            headers: { "Content-Type": "application/json" },
            body: {
                organisations: sqlQuery.data
            }

        }

    } else {

        return {status: sqlQuery.status};

    }
   

}

async function verifyJwtIdentity( req ) {

    // GET JWT IDENTITY

    let refreshToken = null;
    let accessToken = null;

    if ( "AccessToken" in req.body ) {
        accessToken = req.body.AccessToken;
    }

    if ( "RefreshToken" in req.body ) {
        refreshToken = req.body.RefreshToken;
    }

    let auth = await jwtVerify.evaluateAuthentication(accessToken, refreshToken)

    return auth;

}