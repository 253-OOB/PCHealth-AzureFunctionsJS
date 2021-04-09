

module.exports = async function (context, req) {

    context.res = {
        status: 200,
        headers: {
            "Content-Type": "text/html"
        },
        body : context.bindings.inputBlob,
        isRaw: true
    };    
   
}

