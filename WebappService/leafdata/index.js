
const { CosmosClient } = require("@azure/cosmos");
const dotenv = require("dotenv").config({path:__dirname+'/./../.env'});

const jwt = require("../helpers/jwtVerify");
const sql = require("../helpers/sqlConfig");

module.exports = async function (context, req) {

    context.res = await getLeafData(req);

}

async function getLeafData( req ) {

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

    inputs.push({name: "Min", type: sql.Int, value: req.query.Page});

    sqlQueryString = "SELECT LeafID, ComputerName, LeafToken FROM proj09.Leaf WHERE OrganisationID=@OrganisationID";

    sqlQuery = await sql.query( sqlQueryString, inputs );

    if( sqlQuery.status !== 200 ) {
        
        return {status: sqlQuery.status}
    }

    let leaves = [];
    let group = "("
    for(let i=req.query.Page*req.query.Amount; i < sqlQuery.data.length && i < (req.query.Page*req.query.Amount + req.query.Amount); i++) {
        leaves.push( sqlQuery.data[i] );
        group += sqlQuery.data[i] + ",";
    }

    group[group.length - 1] = ")";

    if (leaves.length === 0) {
        return {
            status: 200, 
            body: {
                leaves: []
            }
        }
    }

    for( let i=0; i<leaves.length; i++ ) {

        let cosmosInputs = [{name: "@LeafToken", value: leaves[i].LeafToken}]
        let cosmosQueryString = "SELECT TOP 4 c.type, c.data FROM c WHERE c.leaftoken=@LeafToken order by c.timestamp"

        let cosmosResult = await queryCosmosDB( 'readings', cosmosQueryString, cosmosInputs );

        console.log(cosmosResult);

        if( cosmosResult.status === 200 ) {
            leaves[i].data = cosmosResult.result;
        } else {
            leaves[i].data = []
        }

    }

    return {
        status: 200,
        body: {
            leafdata: leaves
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

async function queryCosmosDB ( containerName, sqlQueryString, inputs ) {

    try{ 

        const client = new CosmosClient( process.env.COSMOSDB );
        const db = client.database( "pc-health" );
        const container = db.container( containerName );

        const cosmosQueryResult = await container.items
            .query({
                query: sqlQueryString,
                parameters: inputs
            })
            .fetchAll();

        return {
            status: 200,
            result: cosmosQueryResult.resources
        }

    } catch (err) {
        console.log(err);
        return { status: 500 }

    }

}