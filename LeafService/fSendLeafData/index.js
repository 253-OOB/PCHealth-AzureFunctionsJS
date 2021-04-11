
const jwtVerify = require("../helpers/jwtVerify");

module.exports = async function (context, req) {

    const sentParam = sendLeafData( req );

    if( sentParam.status == 200 ) {

        console.log(sentParam.data)

        context.bindings.cosmosReadingsDoc = sentParam.data;
        context.res = {status: 200};

    } else {
        context.res = sentParam;
    }

}

function sendLeafData( req ) {

    try{


        if( "LeafToken" in req.body && typeof req.body["LeafToken"] === "string" ) {
        
            isTokenValid = jwtVerify.verifyLeafToken(req.body.LeafToken);
            
            if( isTokenValid.status == 200 ) {

                if( "Data" in req.body ) {

                    return {status: 200, data: req.body.Data};

                } else {

                    return {status: 400};

                }

            } else {

                return {status: isTokenValid.status};

            }

        } else {

            // Will never happen with a valid leaf
            return {status: 400};

        }
        
    } catch (err) {

        // console.log(err);
        return {status: 500};

    }

}