
const sql = require("../helpers/sqlConfig");
const jwt = require("../helpers/jwtVerify");


module.exports = async function (context, req) {
    
    if( req.params.operation == "create" ) {
        context.res = await createTag(req);
    } else if( req.params.operation == "get" ) {
        context.res = await getTags(req);
    } else if ( req.params.operation == "delete" ) {
        context.res = await deleteTag(req);
    } else if ( req.params.operation == "assign" ) {
        context.res = await assignTag(req);
    }   else {
        context.res = {status: 404};
    }

}

async function assignTag ( req ) {

    // ?TagID=x&LeafID=x

    let auth = await verifyAccountJwtIdentity( req );

    if( auth.status !== 200 ) {
        return {status: auth.status};
    }

    let Email = auth.payload.payload;

    if( !("TagID" in req.query && "LeafID" in req.query) ) {
        return {status: 400};
    }

    let inputs = [

        {name: "AccountEmail", type: sql.NVarChar, value: Email},
        {name: "TagID", type: sql.Int, value: parseInt(req.query.TagID)},
        {name: "LeafID", type: sql.Int, value: parseInt(req.query.LeafID)}

    ]

    let sqlQueryString = `
        SELECT AccountID FROM proj09.Accounts_Organisations_V as t1 
            inner join proj09.Leaf as t2 on t1.OrganisationID = t2.OrganisationID  
                WHERE t1.AccountEmail=@AccountEmail AND t2.LeafID=@LeafID
    `;
    let sqlResult = await sql.query(sqlQueryString, inputs);

    if (sqlResult.status !== 200) {
        return {status: sqlResult.status};
    }

    if (sqlResult.data.length !== 1) {
        return { status: 403 };
    }

    try {

        sqlQueryString = "INSERT INTO proj09.LeafTags(LeafID, TagID) VALUES (@LeafID, @TagID)"
        sqlResult = await sql.query(sqlQueryString, inputs);
    
    } catch (err) {

        return {status: 500};
        
    }

    if (sqlResult.status !== 200) {
        return {status: sqlResult.status};
    }

    if( "accessToken" in auth ) {
        
        return {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                AccessToken: auth.accessToken
            }
        };
    
    } else {

        return {
            status: 200
        };

    }

}

async function createTag ( req ) {

    // ?Tag=x
    let auth = verifyOrganisationJwtIdentity( req );

    if( auth.status !== 200 ) {
        return {status: auth.status};
    }

    let OrganisationEmail = auth.payload;

    let tagToInsert = null;

    if( "Tag" in req.query ) {
        tagToInsert = req.query.Tag;
    } else {
        return {status: 400};
    }

    let inputs = [
        {name: "OrganisationEmail", type: sql.NVarChar, value: OrganisationEmail},
        {name: "TagName", type: sql.NVarChar, value: tagToInsert}
    ];

    let sqlQueryString = "SELECT OrganisationID FROM proj09.Organisation WHERE Email=@OrganisationEmail"
    let sqlResult = await sql.query(sqlQueryString, inputs);

    if (sqlResult.status !== 200) {
        return {status: sqlResult.status};
    }

    if( sqlResult.data.length !== 1 ) {
        return {status: 500};
    }

    inputs.push( {name: "OrganisationID", type: sql.Int, value: sqlResult.data[0].OrganisationID} )

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

    let inputs = [{name: "OrganisationID", type: sql.Int, value: parseInt(req.query.OrganisationID)}]; 
    sqlQueryString = "SELECT * FROM proj09.Tags WHERE OrganisationID=@OrganisationID";

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

    let auth = verifyOrganisationJwtIdentity( req );

    if( auth.status !== 200 ) {
        return {status: auth.status};
    }

    let OrganisationEmail = auth.payload.payload;

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

function verifyOrganisationJwtIdentity( req ) {

    // GET JWT IDENTITY

    let organisationToken = null;

    if ( "organisationToken" in req.body ) {
        organisationToken = req.body.organisationToken;
    } else {
        return {status: 400};
    }

    let auth = jwt.verifyAccessToken(organisationToken);

    return auth;

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