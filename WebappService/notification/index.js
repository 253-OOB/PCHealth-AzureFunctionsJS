
const { CosmosClient } = require("@azure/cosmos");
const dotenv = require("dotenv").config({path:__dirname+'/./../.env'});

const jwtVerify = require("../helpers/jwtVerify");
const sql = require("../helpers/sqlConfig");

module.exports = async function (context, req) {
    
    if( req.params.operation === "create" ) {

        context.res = await createNewNotification(req);

    }

}

async function createNewNotification( req ) {

    // ?LeafID=x
    // Verify authentication

    let auth = await verifyJwtIdentity( req );

    if( auth.status !== 200 ) {
        return {status: auth.status};
    }

    let Email = auth.payload.payload;

    if( !("LeafID" in req.query && "notification" in req.body && typeof req.body.notification === "object" && !Array.isArray(req.body.notification) ) ) {
        return {status: 400};
    }

    let inputs = [
        {name: "AccountEmail", type: sql.NVarChar, value: Email},
        {name: "LeafID", type: sql.Int, value: parseInt(req.query.LeafID)}
    ];
    
    let sqlQueryString = `
        SELECT t2.LeafToken FROM proj09.Accounts_Organisations_V as t1 
            inner join proj09.Leaf as t2 on t1.OrganisationID = t2.OrganisationID  
                WHERE t1.AccountEmail=@AccountEmail AND t2.LeafID=@LeafID
    `;

    let sqlQuery = await sql.query(sqlQueryString, inputs);
    
    if( sqlQuery.status !== 200 ) {
        return {status: sqlQuery.status}
    }

    if( sqlQuery.data.length !== 1 ) {
        return {status: 403}
    }

    let cosmosInputs = [ { name: "@LeafToken", value: sqlQuery.data[0].LeafToken } ];
    let cosmosQueryString = "SELECT top 1 * FROM c WHERE c.LeafToken=@LeafToken order by c._ts desc";

    let cosmosResult = await queryCosmosDB( "notifications", cosmosQueryString, cosmosInputs );

    if ( cosmosResult.status !== 200 ) {
        return {status: cosmosResult.status};
    }

    const cosmosClient = initialiseCosmosClient( "notifications" );


    if ( cosmosResult.result.length == 0 ) {


        let insertCosmosResult = await cosmosClient.create(
            {
                LeafToken: sqlQuery.data[0].LeafToken,
                notifications: [

                    req.body.notification

                ]
            }

        );

        if (insertCosmosResult.statusCode !== 200) {
            return {status: insertCosmosResult.statusCode};
        }

    } else {

        let newNotifications = [];
        let valueFound = false;
        for( let i=0; i<cosmosResult.result[0].notifications.length; i++ ) {
            if ( Object.keys(req.body.notification)[0] in cosmosResult.result[0].notifications[i] ) {
                newNotifications.push(req.body.notification);
                valueFound = true;
            } else {
                newNotifications.push(cosmosResult.result[0].notifications[i]);
            }
        }

        if( !valueFound ) {
            newNotifications.push(req.body.notification);
        }

        let insertCosmosResult = await cosmosClient.upsert( {
            LeafToken: sqlQuery.data[0].LeafToken,
            notifications: newNotifications
        });
        
        if (insertCosmosResult.statusCode !== 200) {
            return {status: insertCosmosResult.statusCode};
        }


    }

    if( "accessToken" in auth ) {

        return {

            status: 200,
            headers: { "Content-Type": "application/json" },
            body: { AccessToken: auth.accessToken }
    
        }

    } else {

        return { status: 200 }

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

function initialiseCosmosClient( containerName ) {

    const client = new CosmosClient( process.env.COSMOSDB );
    const db = client.database( "pc-health" );
    const container = db.container( containerName ).items;
    
    return container;

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