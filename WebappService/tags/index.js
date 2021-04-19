
const sql = require("../helpers/sqlConfig");
const jwt = require("../helpers/jwtVerify");


module.exports = async function (context, req) {
    
    if( req.parameters.operation == "create" ) {
        context.res = createTag(req);
    } else if( req.parameters.operation == "get" ) {
        context.res = getTags(req);
    } else if ( req.parameters.operation == "delete" ) {
        context.res = deleteTag(req);
    } else {
        context.res = {status: 404};
    }

}

async function createTag ( req ) {

    // ?Tag=x

    let auth = verifyJwtIdentity( req );

    if( auth.status !== 200 ) {
        return {status: auth.status};
    }

    let OrganisationEmail = auth.payload.payload.payload;

    let tagToInsert = null;

    if( "Tag" in req.query ) {
        let tagToInsert = req.query.Tag;
    } else {
        return {status: 400};
    }

    let inputs = [
        {name: "OrganisationEmail", type: sql.NVarChar, value: OrganisationEmail},
        {name: "TagName", type: sql.NVarChar, value: tagToInsert}
    ];

    const sqlQueryString = "SELECT OrganisationID FROM proj09.Organisation WHERE Email=@OrganisationEmail"
    let sqlResult = await sql.query(sqlQuery, inputs);

    if (sqlResult !== 200) {
        return {status: sqlResult.status};
    }

    if( sqlResult.rows !== 1 ) {
        return {status: 500};
    }

    inputs.push( {name: "OrganisationID", type: sql.Int, value: sqlResult[0].OrganisationID} )

    sqlQueryString = "INSERT INTO proj09.Tags (TagName, OrganisationID) values (@TagName, @OrganisationID)";
    sqlResult = await sql.query(sqlQueryString, inputs);

    if(sqlResult.status !== 200) {
        return {status: sqlResult.status};
    }

    return { status: 200 }
    
}

async function getTags( req ) {

    if( !("OrganisationID" in req.query)  ) {
        return {status: 400};
    }

    let inputs = [{name: "OrganisationID", type: sql.Int, value: req.query.OrganisationID}]; 
    sqlQueryString = "SELECT * FROM Tags WHERE OrganisationID=@OrganisationID";

    let sqlResult = await sql.query(sqlQueryString, inputs);

    if(sqlResult.status !== 200) {
        return {status: sqlResult.status};
    }

    return {

        status: 200,
        headers: { "Content-Type": "application/json" },
        body: {
            tags: sqlResult.data
        }

    }

}

async function deleteTag( req ) {

    // ?Tag=x

    let auth = verifyJwtIdentity( req );

    if( auth.status !== 200 ) {
        return {status: auth.status};
    }

    let OrganisationEmail = auth.payload.payload.payload;

    let tagToDelete = null;

    if( "Tag" in req.query ) {
        tagToDelete = req.query.Tag;
    } else {
        return {status: 400};
    }

    let inputs = [
        {name: "OrganisationEmail", type: sql.NVarChar, value: OrganisationEmail},
        {name: "TagName", type: sql.NVarChar, value: tagToDelete}
    ];

    sqlQueryString = "DELETE FROM proj09.Tags WHERE TagName=@TagName AND OrganisationEmail=(SELECT OrganisationID FROM proj09.Organisation WHERE Email=@OrganisationEmail)";

    let sqlResult = await sql.query(sqlQueryString, inputs);

    if(sqlResult.status !== 200) {
        return {status: sqlResult.status};
    }

    return { status: 200 }

}

function verifyJwtIdentity( req ) {

    // GET JWT IDENTITY

    let organisationToken = null;

    if ( "OrganisationToken" in req.body ) {
        organisationToken = req.body.organisationToken;
    } else {
        return {status: 400};
    }

    let auth = jwt.verifyAccessToken(organisationToken);

    return auth;

}