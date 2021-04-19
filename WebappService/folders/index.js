
const sql = require("../helpers/sqlConfig");
const jwtVerify = require("../helpers/jwtVerify");

module.exports = async function (context, req) {
    
    // Verify route parameter

    // Create
    if( req.params.operation == "create" ) {

        // context.res = await createFolder( req );

    } else if (req.params.operation == "get") {

        context.res = await getLeavesAndFolders( req );

    } else if (req.params.operation == "move") {

        // context.res = await moveFolderOrLeaf( req );

    } else if (req.params.operation == "delete") {

        // context.res = await deleteFolder( req );

    } else {
        return {status: 404};
    }

    // Get
    // Update
    // Delete

    // 

}

async function createFolder( context, req ) {

    // ?FolderName=x&(ParentFolderID=x|OrganisationID=x)

    if ( !("FolderName" in req.query) ) {
        return {status: 400};
    }

    let auth = await verifyJwtIdentity( req );

    if( auth.status !== 200 ) {
        return {status: auth.status};
    }

    let inputs = [
        {name: "AccountEmail", type: sql.NVarChar, value: auth.payload.payload.payload},
        {name: "FolderName", type: sql.NVarChar, value: req.query.FolderName}
    ];

    // Verify access rights of the account

    let createFolder = "";

    if( "ParentFolderID" in req.body ) {
        
        // Verify if Email has the correct access rights

        inputs.push({name: "FolderID", type: sql.Int, value: req.body.ParentFolderID});
        let getFolderInfo = "SELECT * FROM proj09.Folders WHERE FolderID=@FolderID"

        let sqlResult = await sql.query(getFolderInfo, inputs);

        if ( sqlResult.status !== 200 ) {
            return {status: sqlResult.status};
        }

        if ( sqlResult.rows === 0 ) {
            return {status: 404};
        }

        inputs.push({name: "OrganisationID", type: sql.Int, value: sqlResult.data[0].OrganisationID});
        
        let verifyEmail = "SELECT * FROM proj09.Accounts_Organisations_V WHERE AccountEmail=@AccountEmail AND OrganisationID=@OrganisationID"
        
        sqlResult = await sql.query(verifyEmail, inputs);

        if ( sqlResult.status !== 200 ) {
            return {status: sqlResult.status};
        }

        if ( sqlResult.rows !== 1 ) {
            return {status: 403};
        }

        let verifyAccessRights = "SELECT * FROM proj09.FolderOwners_V WHERE FolderID=@FolderID"
        sqlResult = await sql.query(verifyAccessRights, inputs);

        if ( sqlResult.status !== 200 ) {
            return {status: sqlResult.status};
        }

        if ( sqlResult.rows > 0 ) {

            let access = false;

            for(let i=0; i<sqlResult.data.length; i++) {

                if( sqlResult.data === auth.payload.payload.payload ) {
                    access = true;
                    break;
                }

            }

            if ( !access ) {
                return {status: 403};
            }

        }

        createFolder = "INSERT INTO proj09.Folders (FolderName, ParentFolderID, OrganisationID) values (@FolderName, @FolderID, @OrganisationID)";

    } else if ( "OrganisationID" in req.body ) {

        // Verify if Email is a valid member of the Organisation:
        inputs.push({name: "OrganisationID", type: sql.Int, value: req.query.OrganisationID});
        let verifyEmail = "SELECT * FROM proj09.Accounts_Organisations_V WHERE AccountEmail=@AccountEmail AND OrganisationID=@OrganisationID"

        let sqlResult = await sql.query(verifyEmail, inputs);

        if( sqlResult.status !== 200 ) {
            return {status: sqlResult.status};
        }

        if( sqlResult.rows !== 1 ) {
            return {status: 403};
        }

        createFolder = "INSERT INTO proj09.Folders (FolderName, OrganisationID) values (@FolderName, @OrganisationID)";

    } else {

        return{status: 400};

    }
    
    let sqlResult = await sql.query(getFolders, inputs);

    if( sqlResult.status !== 200 ) {
        return {status: sqlResult.status};
    }

    if ( "accessToken" in auth ) {

        return {

            status: 200,
            headers: { "Content-Type": "application/json" },
            body: {
                AccessToken: auth.accessToken
            }
    
        }

    } else {

        return { status: 200 }

    }
    
}

async function moveLeaf( req ) {

    // ?LeafID=x&(NewParentFolderID=x|OrganisationID=x)
    
}

async function getLeavesAndFolders( req ) {

    // ?(FolderID=h|OragnisationID=a)

    // Verify authentication

    let auth = await verifyJwtIdentity( req );

    if( auth.status !== 200 ) {
        return {status: auth.status};
    }

    let inputs = [
        {name: "AccountEmail", type: sql.NVarChar, value: auth.payload.payload.payload}
    ]

    let getFolders = "";
    let getLeaves = "";

    if( "FolderID" in req.body ) {
        
        // Verify if Email has the correct access rights

        inputs.push({name: "FolderID", type: sql.Int, value: req.body.FolderID});
        let getFolderInfo = "SELECT * FROM proj09.Folders WHERE FolderID=@FolderID"

        let sqlResult = await sql.query(getFolderInfo, inputs);

        if ( sqlResult.status !== 200 ) {
            return {status: sqlResult.status};
        }

        if ( sqlResult.rows === 0 ) {
            return {status: 404};
        }

        inputs.push({name: "OrganisationID", type: sql.Int, value: sqlResult.data[0].OrganisationID});
        
        let verifyEmail = "SELECT * FROM proj09.Accounts_Organisations_V WHERE AccountEmail=@AccountEmail AND OrganisationID=@OrganisationID"
        
         sqlResult = await sql.query(verifyEmail, inputs);

        if ( sqlResult.status !== 200 ) {
            return {status: sqlResult.status};
        }

        if ( sqlResult.rows !== 1 ) {
            return {status: 403};
        }

        let verifyAccessRights = "SELECT * FROM proj09.FolderOwners_V WHERE FolderID=@FolderID"
        sqlResult = await sql.query(verifyAccessRights, inputs);

        if ( sqlResult.status !== 200 ) {
            return {status: sqlResult.status};
        }

        if ( sqlResult.rows > 0 ) {

            let access = false;

            for(let i=0; i<sqlResult.data.length; i++) {

                if( sqlResult.data === (await auth).payload.payload.payload ) {
                    access = true;
                    break;
                }

            }

            if ( !access ) {
                return {status: 403};
            }

        }

        getFolders = "SELECT * FROM proj09.Folders WHERE ParentFolderID=@FolderID";
        getLeaves = "SELECT * FROM proj09.Leaf WHERE FolderID=NULL AND OrganisationID=@OrganisationID";

    } else if ( "OrganisationID" in req.body ) {

        // Verify if Email is a valid member of the Organisation:
        inputs.push({name: "OrganisationID", type: sql.Int, value: req.query.OrganisationID});
        let verifyEmail = "SELECT * FROM proj09.Accounts_Organisations_V WHERE AccountEmail=@AccountEmail AND OrganisationID=@OrganisationID"

        let sqlResult = await sql.query(verifyEmail, inputs);

        if( sqlResult.status !== 200 ) {
            return {status: sqlResult.status};
        }

        if( sqlResult.rows !== 1 ) {
            return {status: 403};
        }

        getFolders = "SELECT * FROM proj09.Folders WHERE ParentFolderID=NULL AND OrganisationID=@OrganisationID";
        getLeaves = "SELECT * FROM proj09.Leaf WHERE FolderID=NULL AND OrganisationID=@OrganisationID";

    } else {

        return{status: 400};

    }

    let sqlResult = await sql.query(getFolders, inputs);

    if( sqlResult.status !== 200 ) {
        return {status: sqlResult.status};
    }

    let folders = sqlResult.data;

    sqlResult = await sql.query(getLeaves, inputs);

    if (sqlResult.status !== 200) {
        return {status: sqlResult.status};
    }

    let leaves = sqlResult.data;

    if ( "accessToken" in auth ) {

        return {

            status: 200,
            headers: { "Content-Type": "application/json" },
            body: {
                folders: folders,
                leaves: leaves,
                AccessToken: auth.accessToken
            }
    
        }

    } else {

        return {

            status: 200,
            headers: { "Content-Type": "application/json" },
            body: {
                folders: folders,
                leaves: leaves
            }
    
        }

    }

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