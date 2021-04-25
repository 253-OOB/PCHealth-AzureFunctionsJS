
const { CosmosClient } = require("@azure/cosmos");
const dotenv = require("dotenv").config({path:__dirname+'/./../.env'});

const jwtVerify = require("../helpers/jwtVerify");

module.exports = async function (context, req) {

    const res = await processRequest( req );
    console.log(res);
    context.res = res;

    if ( res.status === 200 ) {
        context.bindings.cosmosReadingsDoc = req.body.Data;
    }

}

async function processRequest( req ) {

    const isRequestValid = verifyValidityOfRequest( req );

    if( isRequestValid.status !== 200 ) {
        return {status: isRequestValid.status};
    }

    const isNewNotificationPresent = await checkForNewNotificationSettings( req );
    
    if( isNewNotificationPresent.status !== 200 ) {
        // Returns 200 as we do not need to signal to the leaf an error if a new notification setting is not present.
        return {status: 200};
    }

    return isNewNotificationPresent;

}

function verifyValidityOfRequest( req ) {

    if( !("LeafToken" in req.body && typeof req.body["LeafToken"] === "string" && "Data" in req.body) ) {
        return {status: 400};
    }

    const isTokenValid = jwtVerify.verifyLeafToken(req.body.LeafToken);

    if ( isTokenValid.status !== 200 ) {
        return {status: isTokenValid.status};
    }

    if( req.body.LeafToken !== req.body.Data.leaftoken ) {
        console.log("hello");
        return {status: 403};
    }

    return {status: 200};

}

async function checkForNewNotificationSettings( req ) {

    let cosmosInputs = [ { name: "@LeafToken", value: req.body.LeafToken } ];

    let cosmosQueryString = "SELECT top 1 * FROM c WHERE c.LeafToken=@LeafToken order by c._ts desc";

    let cosmosResult = await queryCosmosDB( "notifications", cosmosQueryString, cosmosInputs );
    console.log(cosmosResult);


    if ( cosmosResult.status !== 200 ) {
        return {status: cosmosResult.status};
    }

    if ( cosmosResult.result.length == 0 ) {

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {}
        }
        
    } else if ( "_ts" in req.body && req.body._ts < cosmosResult.result[0]._ts ) {

        return {

            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                notifications: cosmosResult.result[0].notifications,
                _ts: cosmosResult.result[0]._ts
            }

        }

    } else {

        return {

            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                notifications: {}
            }

        }

    }

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

        return { status: 500 }

    }

}