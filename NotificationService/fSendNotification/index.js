const sql = require("../helpers/sqlConfig");

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
            console.log("1");
            if(leafIDPresent 
                && organisationIDPresent 
                && titlePresent 
                && timeStampPresent 
                && contentPresent 
                && causingValuePresent 
                && communicationMethodPresent) {
                    console.log("2");
                    dbInsertOperation = await insertNotificationInDB(
                                                            req.body["LeafID"], 
                                                            req.body["OrganisationID"], 
                                                            req.body["Title"], 
                                                            timeStampAsDateStr, 
                                                            req.body["Content"], 
                                                            req.body["CausingValue"], 
                                                            req.body["CommunicationMethod"]
                                                            );
                
                    console.log(dbInsertOperation.status);
                    console.log("3");
                
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