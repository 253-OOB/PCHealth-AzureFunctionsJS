
const dotenv = require("dotenv").config({path:__dirname+'/./../.env'});
const fetch = require("node-fetch");

const jwtVerify = require("../helpers/jwtVerify");
const sql = require("../helpers/sqlConfig");


module.exports = async function (context, req) {

    const h = await sendLeafNotification(req)
    console.log(h);
    context.res = h;

}

async function sendLeafNotification( req ) {

    const isRequestValid = verifyValidityOfRequest( req );

    if( isRequestValid.status !== 200 ) {
        return {status: isRequestValid.status};
    }

    const isInsertSuccessful = await insertNotificationsInDB( req ) 
    
    if( isInsertSuccessful.status !== 200 ){
        return {status: isInsertSuccessful.status};
    }

    await fetch (
        process.env.NOTIFICATION_URL + "fSendNotification", 
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                Notifications: req.body.Notifications
            })
        }
    );

    return {status: 200};


}

function verifyValidityOfRequest( req ) {

    if( !("LeafToken" in req.body && typeof req.body["LeafToken"] === "string" && "Notifications" in req.body) ) {
        return {status: 400};
    }

    const isTokenValid = jwtVerify.verifyLeafToken(req.body.LeafToken);

    if ( isTokenValid.status !== 200 ) {
        return {status: isTokenValid.status};
    }

    let isValid = true;

    for(let i=0; i<req.body.Notifications.length; i++) {

        let field = req.body.Notifications[i];

        isValid = isValid && ("Title" in field) && (typeof (field["Title"] === "string"));
        isValid = isValid && ("TimeStamp" in field) && (typeof (field["TimeStamp"] === "string"));
        isValid = isValid && ("Content" in field) && (typeof (field["Content"] === "string"));
        isValid = isValid && ("CausingValue" in field) && (typeof (field["CausingValue"] === "string"));
        isValid = isValid && ("CommunicationMethod" in field) && (typeof (field["CommunicationMethod"] === "string"));

    }

    if ( !(isValid) ) {
        return {status: 400};
    }

    return { status: 200 }

}

async function insertNotificationsInDB( req ) {

    let inputs = [
        { name: "LeafToken", type: sql.NVarChar, value: req.body.LeafToken }
    ]

    let sqlQueryString = "SELECT LeafID, OrganisationID FROM proj09.Leaf WHERE LeafToken=@LeafToken"

    let sqlResult = await sql.query(sqlQueryString, inputs);

    if( sqlResult.status !== 200 ) {
        return {status: sqlResult.status};
    }

    if( sqlResult.data.length !== 1) {
        return {status: 403};
    }

    sqlQueryString = `
        INSERT INTO proj09.Notifications (LeafID, OrganisationID, Title, [TimeStamp], Content, CausingValue, CommunicationMethod) 
            VALUES
    `;

    for(let i=0; i<req.body.Notifications.length; i++) {
        
        inputs = inputs.concat([

            { name: "LeafID" + i             , type: sql.Int     , value: sqlResult.data[0].LeafID                      },
            { name: "OrganisationID" + i     , type: sql.Int     , value: sqlResult.data[0].OrganisationID              },
            { name: "Title" + i              , type: sql.NVarChar, value: req.body.Notifications[i].Title               },
            { name: "TimeStamp" + i          , type: sql.DateTime, value: req.body.Notifications[i].TimeStamp           },
            { name: "Content" + i            , type: sql.NVarChar, value: req.body.Notifications[i].Content             },
            { name: "CausingValue" + i       , type: sql.NVarChar, value: req.body.Notifications[i].CausingValue        },
            { name: "CommunicationMethod" + i, type: sql.NVarChar, value: req.body.Notifications[i].CommunicationMethod }

        ]);

        console.log(inputs); 

        sqlQueryString += `(@LeafID${i}, @OrganisationID${i}, @Title${i}, @TimeStamp${i}, @Content${i}, @CausingValue${i}, @CommunicationMethod${i})`

        if( i < req.body.Notifications.length - 1 ) {
            sqlQueryString += ","
        }

    }

    console.log(sqlQueryString)

    sqlResult = await sql.query( sqlQueryString, inputs );

    if (sqlResult.status !== 200) {
        return {status: sqlResult.status};
    }

    return {status: 200};

}