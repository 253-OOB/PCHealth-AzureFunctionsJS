

module.exports = async function (context, req) {

    fSignupCompany();
    context.res.status = 501;
    
}

function fSignupCompany() {



}

// Name
// Password
// Email - Varify that its a valid
function verifyCredentials(req) {

}

// TODO: (Issue #4) Verify if Data input is in correct format
// TODO: (Issue #5) Verify is Organisation Name or Email is not already used
// TODO: (Issue #8) Insert Data into the Database
/* TODO: (Issue #6) Send confirmation e-mail Inside */