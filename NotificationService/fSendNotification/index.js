const sql = require("../helpers/sqlConfig");
const smsSender = require("../helpers/smstest")
const emailSender = require("../helpers/emailtest")

module.exports = async function (context, req) {

    try {

        if ( req.body != null ) {

            const leafIDPresent = ("LeafID" in req.body) && (typeof (req.body["LeafID"] === "number"));
            const organisationIDPresent = ("OrganisationID" in req.body) && (typeof (req.body["OrganisationID"] === "number"));
            const titlePresent = ("Title" in req.body) && (typeof (req.body["Title"] === "string"));
            const timeStampPresent = ("TimeStamp" in req.body) && (typeof (req.body["TimeStamp"] === "number"));
            const contentPresent = ("Content" in req.body) && (typeof (req.body["Content"] === "string"));
            const causingValuePresent = ("CausingValue" in req.body) && (typeof (req.body["CausingValue"] === "string"));
            const communicationMethodPresent = ("CommunicationMethod" in req.body) && (typeof (req.body["CommunicationMethod"] === "string"));

            const timeStampAsDateStr = new Date(req.body["TimeStamp"] * 1000).toISOString();

            if(leafIDPresent 
                && organisationIDPresent 
                && titlePresent 
                && timeStampPresent 
                && contentPresent 
                && causingValuePresent 
                && communicationMethodPresent) {
                    
                    dbInsertOperation = await insertNotificationInDB(
                                                            req.body["LeafID"], 
                                                            req.body["OrganisationID"], 
                                                            req.body["Title"], 
                                                            timeStampAsDateStr, 
                                                            req.body["Content"], 
                                                            req.body["CausingValue"], 
                                                            req.body["CommunicationMethod"]
                                                            );
                    if(dbInsertOperation.status === 200) {
                        
                        if(req.body["CommunicationMethod"] === "sms") {
                            
                            retrievePhoneNumberOperation = await retrievePhoneNumber(req.body["OrganisationID"]);
                            
                            if(retrievePhoneNumberOperation.status === 200) {
                            
                                phoneNumber = retrievePhoneNumberOperation.response.recordset[0].Phone;
                                smsSender.sendSMS(phoneNumber, req.body["Content"]);
                            
                            }

                        } else if(req.body["CommunicationMethod"] === "email") {
                            
                            retrieveEmailOperation = await retrieveEmail(req.body["OrganisationID"]);
                            
                            if(retrieveEmailOperation.status === 200) {
                            
                                email = retrieveEmailOperation.response.recordset[0].Email;    
                                console.log(email);                        
                                emailSender.sendEMail(email, "Email from Admin", req.body["Content"]);
                                console.log("Was the email sent?");
                            
                            }

                        }

                    }
                
            } else {
            
                return {status: 400};
    
            }

        }

    } catch (error) {

        return {status: 500};

    }
}

async function insertNotificationInDB(leafID, organisationID, title, timeStampDate, content, causingValue, communicationMethod) {
    
    try {

        inputs = [
            {
                name: "LeafID",
                type: sql.Int,
                value: leafID
            },
            {
                name: "OrganisationID",
                type: sql.Int,
                value: organisationID
            },
            {
                name: "Title",
                type: sql.NVarChar,
                value: title
            },
            {
                name: "TimeStamp",
                type: sql.DateTime,
                value: timeStampDate
            },
            {
                name: "Content",
                type: sql.NVarChar,
                value: content
            },
            {
                name: "CausingValue",
                type: sql.NVarChar,
                value: causingValue
            },
            {
                name: "CommunicationMethod",
                type: sql.NVarChar,
                value: communicationMethod
            }
        ]

        sql_results = await sql.query("INSERT INTO proj09.Notifications (LeafID, OrganisationID, Title, [TimeStamp], Content, CausingValue, CommunicationMethod) VALUES (@LeafID, @OrganisationID, @Title, @TimeStamp, @Content, @CausingValue, @CommunicationMethod)", inputs);
        return sql_results;
    
    } catch (error) {

        console.log(error);
        return {status: 500};

    }

}

async function retrievePhoneNumber(organisationID) {
    try {

        inputs = [
            {
                name: "OrganisationID",
                type: sql.Int,
                value: organisationID
            }
        ]

        sql_results = await sql.querySelect("SELECT Phone FROM proj09.Organisation WHERE OrganisationID = @OrganisationID", inputs);
        return sql_results;
    
    } catch (error) {

        console.log(error);
        return {status: 500};

    }

}

async function retrieveEmail(email) {
    try {

        inputs = [
            {
                name: "Email",
                type: sql.Int,
                value: email
            }
        ]

        sql_results = await sql.querySelect("SELECT Email FROM proj09.Organisation WHERE OrganisationID = @Email", inputs);
        return sql_results;
    
    } catch (error) {

        console.log(error);
        return {status: 500};

    }

}