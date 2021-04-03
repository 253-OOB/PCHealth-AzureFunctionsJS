module.exports = async function (context, req) {
    
    
    context.res.status = 501;

}

function VerifyFormat(req) {
    if (req == null) return false;
    if (req.query == null) return false;
    if (
      req.query.Name == null &&
      req.query.Email == null &&
      req.query.Password == null
    )
      return false;
  
    // Must only include alphanumeric numbers (underscores included, dashes not)
    const nameFormat = new RegExp("^[A-Za-z0-9_]+$");
    // A valid email consists of: email prefix + @ + email domain + 1 or more top domain;
    const emailFormat = new RegExp(
      "^(?!.*([!#$%&'*+\-/=?^_`{|])\1)[A-Za-z0-9][A-Za-z0-9!#$%&'*+\-/=?^_`{|]{0,63}[@][A-Za-z0-9-]{1,253}([.][A-Za-z0-9]+)+$"
    );
    // Minimum of 8 length + 1 Upper case + 1 Lower case + 1 Number + 1 Special char
    const passwordFormat = new RegExp(
      "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*#?&])[[A-Za-z0-9@$!%*#?&]{8,}$"
    );
  
    return (
      nameFormat.test(req.query.Name) &&
      emailFormat.test(req.query.Email) &&
      passwordFormat.test(req.query.Password)
    );
  }

// TODO: (Issue #7) Only accept the request if token is signed by the root level account (company accout) (return 401 if not accept) (return company name).
// TODO: (Issue #10) Verify if Username is not already used inside the Company or Email is not already used.
// TODO: (Issue #11) Insert Data into the Database.
/* TODO: (Issue #6) Send confirmation e-mail */
