
const sql = require("../helpers/sqlConfig");
const notification = require("../helpers/notificationConfig");

module.exports = async function (context, req) {

    context.res = await sendNotification( req );

}

async function sendNotification( req ) {

    const contactInfo = await retrieveContactInfo( req.body.OrganisationID );

    if( contactInfo.status !== 200 ) {
        return {status: contactInfo.status};
    }

    if( req.body.CommunicationMethod === "sms" && contactInfo.Phone !== null ) {

        let smsMessage = `
            ${req.body.Title},
            
            ${req.body.Content}

            Causing Value: ${req.body.CausingValue}
            --------------
        `;

        await notification.sendSMS(contactInfo.Phone, smsMessage);

    } else if (req.body.CommunicationMethod === "email") {

        let Email = `
            Dear Customer,
            
            ${req.body.Content}

            Causing Value: ${req.body.CausingValue}
            --------------
        `;

        notification.sendEMail(contactInfo.Email, req.body.Title, Email);

    } else if (req.body.CommunicationMethod === "both") {

        let smsMessage = `
            ${req.body.Title},
            
            ${req.body.Content}

            Causing Value: ${req.body.CausingValue}
            --------------
        `;

        await notification.sendSMS(contactInfo.Phone, smsMessage);

        let Email = `
            Dear Customer,
            
            ${req.body.Content}

            Causing Value: ${req.body.CausingValue}
            --------------
        `;

        notification.sendEMail(contactInfo.Email, req.body.Title, Email);

    } else {

        return {status: 200};
    
    }

}

async function retrieveContactInfo(organisationID) {
    
    inputs = [
        {
            name: "OrganisationID",
            type: sql.Int,
            value: organisationID
        }
    ]

    let sqlResult = await sql.query("SELECT Email, Phone FROM proj09.Organisation WHERE OrganisationID = @OrganisationID", inputs);

    if( sqlResult.status !== 200 ) {
        return {status: sqlResult.status};
    }

    if( sqlResult.data.length !== 1 ) {
        return {status: 404};
    } 

    return {
        status: 200,
        Phone: sqlResult.data[0].Phone,
        Email: sqlResult.data[0].Email
    };
    

}