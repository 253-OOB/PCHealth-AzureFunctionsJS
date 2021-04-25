
const dotenv = require("dotenv").config({path:__dirname+'/./../.env'});

const jwt = require("../helpers/jwtVerify");
const sql = require("../helpers/sqlConfig");

module.exports = async function (context, req) {
    
    context.res = await getNotifications( req );

}

async function getNotifications( req ) {

    // ?OrganisationID=x&Page=x&Amount=x

    let auth = await verifyAccountJwtIdentity( req );

    if( auth.status !== 200 ) {
        return {status: auth.status};
    }

    let Email = auth.payload.payload;

    if( !("OrganisationID" in req.query && "Page" in req.query && "Amount" in req.query) ) {
        return {status: 400};
    }

    let inputs = [
        {name: "AccountEmail", type: sql.NVarChar, value: Email},
        {name: "OrganisationID", type: sql.Int, value: parseInt(req.query.OrganisationID)}
    ];
    
    let sqlQueryString = "SELECT OrganisationID, OrganisationName FROM proj09.Accounts_Organisations_V WHERE AccountEmail=@AccountEmail AND OrganisationID=@OrganisationID";
    let sqlQuery = await sql.query(sqlQueryString, inputs);
    
    if( sqlQuery.status !== 200 ) {
        
        return {status: sqlQuery.status}
    }

    if( sqlQuery.data.length !== 1 ) {
        return {status: 403};
    }

    inputs.push({name: "Offset", type: sql.Int, value: req.body.Page*req.body.Amount});
    inputs.push({name: "Limit", type: sql.Int, value: req.body.Page*req.body.Amount + req.body.Amount});
    sqlQueryString = "SELECT * FROM proj09.Notifications WHERE OrganisationID=@OrganisationID ORDER BY TimeStamp DESC OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY";

    sqlQuery = await sql.query( sqlQueryString, inputs );

    if( sqlQuery.status !== 200 ) {
        return {status: sqlQuery.status}
    }

    return {
        status: 200,
        body: {
            notifications: sqlQuery.data
        }
    };

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