
const jwt = require("../helpers/jwtVerify");
const jwtInit = require("../helpers/generateToken");
const sql = require("../helpers/sqlConfig")


module.exports = async function (context, req) {
    
    context.res = await getInfo( req );

}

async function getInfo( req ) {

    // ?OrganisationID=x

    let auth = await verifyAccountJwtIdentity( req );

    if( auth.status !== 200 ) {
        return {status: auth.status};
    }

    let Email = auth.payload.payload;

    if( !("OrganisationID" in req.query) ) {
        return {status: 400};
    }

    let inputs = [

        {name: "AccountEmail", type: sql.NVarChar, value: Email},
        {name: "OrganisationID", type: sql.NVarChar, value: req.query.OrganisationID}

    ]

    let sqlQueryString = "SELECT OrganisationEmail FROM proj09.Accounts_Organisations_V WHERE AccountEmail=@AccountEmail AND OrganisationID=@OrganisationID";
    let sqlResult = await sql.query(sqlQueryString, inputs);

    if (sqlResult.status !== 200) {
        return {status: sqlResult.status};
    }

    if (sqlResult.data.length !== 1) {
        return { status: 403 };
    }

    const initialisationToken = await jwtInit.generateInitialisationToken( sqlResult.data[0].OrganisationEmail );

    if( initialisationToken.status !== 200 ) {
        return {status: initialisationToken.status};
    }

    return {
        status: 200,
        headers: {
            'Content-Type': 'application/text'
        },
        body: {
            initFile: JSON.stringify({
                init: {
                    special_auth_token: initialisationToken.InitialisationToken
                }
            })
        }
    }

}

async function verifyAccountJwtIdentity( req ) {

    // GET JWT IDENTITY

    let refreshToken = null;
    let accessToken = null;

    if ( "AccessToken" in req.body ) {
        accessToken = req.body.AccessToken;
    }

    if ( "RefreshToken" in req.body ) {
        refreshToken = req.body.RefreshToken;
    }

    let auth = await jwt.evaluateAuthentication(accessToken, refreshToken)

    return auth;


}