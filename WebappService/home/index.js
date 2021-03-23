module.exports = async function (context, req) {    

    const spliturl = req.url.split("/");
    const filetype = spliturl[ spliturl.length - 1 ].split(".")[1];

    context.res = {
        status: 200,
        headers: {
            "Content-Type": "text/" + filetype
        },
        body : context.bindings.indexBlob,
        isRaw: true
    };
        
}