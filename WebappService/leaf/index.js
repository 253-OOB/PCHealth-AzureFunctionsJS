const jwtVerify = require("../helpers/jwtVerify");
const sql = require("../helpers/sqlConfig");

module.exports = async function (context, req) {
    
    context.res = await getLeaves(req);
    
}

async function getLeaves( req ) {

    // ?OrganisationID

    // Verify authentication

    let auth = await verifyJwtIdentity( req );

    if( auth.status !== 200 ) {
        return {status: auth.status};
    }

    let Email = auth.payload.payload;

    if( !("OrganisationID" in req.query) ) {
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
    
    sqlQueryString = "SELECT LeafID, AssignedName, ComputerName, OrganisationID, FolderID FROM proj09.Leaf WHERE OrganisationID=@OrganisationID"
    sqlQuery = await sql.query( sqlQueryString, inputs );

    if( sqlQuery.status !== 200 ) {
        return {status: sqlQuery.status}
    }

    let leaves = sqlQuery.data;

    console.log(leaves);

    sqlQueryString = "SELECT * FROM proj09.LeafTags WHERE LeafID=(SELECT LeafID from proj09.Leaf WHERE OrganisationID=@OrganisationID)"
    sqlQuery = await sql.query( sqlQueryString, inputs );

    if( sqlQuery.status !== 200 ) {
        return {status: sqlQuery.status}
    }

    leaves = assignTagsToLeaves(sqlQuery.data, leaves);

    if( "accessToken" in auth ) {

        return {

            status: 200,
            headers: { "Content-Type": "application/json" },
            body: {
                leaves: leaves,
                AccessToken: auth.accessToken
            }
    
        }

    } else {

        return {

            status: 200,
            headers: { "Content-Type": "application/json" },
            body: {
                leaves: leaves
            }
    
        }

    }
    

}

function assignTagsToLeaves( tags, leaves ) {

    for( let i=0; i<leaves.length; i++ ) {

        leaves[i].tags = [];

        for( let j=0; j<tags.length; j++ ) {

            if( leaves[i].LeafID == tags[j].LeafID ) {
                leaves[i].tags.push({TagID: tags[j].TagID}); 
            }

        } 

    }
    
    return leaves;

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