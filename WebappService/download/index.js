
const fetch = require("node-fetch");
const AzureStorageBlob = require("@azure/storage-blob");
const dotenv = require("dotenv").config({path:__dirname+'/./../.env'});


module.exports = async function (context, req) {

    const containerName = process.env.C_NAME;
    const storageAccountName = process.env.ACCOUNT_NAME;
    const storageAccountKey = process.env.ACCOUNT_KEY;
    const path = "leaf/leafapp/pchealth.zip";

    const blobSAS = AzureStorageBlob.generateBlobSASQueryParameters(

        {
            containerName: containerName,
            permissions: AzureStorageBlob.BlobSASPermissions.parse("r"),
            blobName: path,
            startsOn: new Date,
            expiresOn: new Date(new Date().valueOf() + 54000)
        },

        new AzureStorageBlob.StorageSharedKeyCredential(storageAccountName, storageAccountKey)

    ).toString();

    context.log(process.env.C_NAME);

    context.res = {
        status: 301,
        headers: {
            Location: `https://${process.env.ACCOUNT_NAME}.blob.core.windows.net/${process.env.C_NAME}/${path}?${blobSAS}`
        }
    }

}

async function generateInitialisationToken( payload ) {

    try {

        const refreshTokenPayload = {
            payload: payload
        }

        const getToken = await fetch (
            "http://localhost:7072/api/fGenerateInitialisationToken", 
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(refreshTokenPayload)
            }
        )

        if( getToken.status == 200 ) {

            const refreshToken = await getToken.json();

            return {
                status: 200,
                InitialisationToken: refreshToken["token"]
            };

        } else {
            return {status: getToken.status};
        }

    } catch (err) {

        console.log(err);
        return { status: 500 }

    }


}