module.exports = async function (context, req) {
    
    
    context.res.status = 501;

}

// TODO: (Issue #7) Only accept the request if token is signed by the root level account (company accout) (return 401 if not accept) (return company name).
// TODO: (Issue #9) Verify if Data that the input is in correct format (library).
// TODO: (Issue #10) Verify if Username is not already used inside the Company or Email is not already used.
// TODO: (Issue #11) Insert Data into the Database.
/* TODO: (Issue #6) Send confirmation e-mail */
