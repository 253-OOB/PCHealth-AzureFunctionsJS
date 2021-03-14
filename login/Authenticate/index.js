
const sql = require("mssql");
const dotenv = require("dotenv").config();

const SQL_SERVER=process.env.SQL_SERVER;
const SQL_USER=process.env.SQL_USER;
const SQL_PASS=process.env.SQL_PASS;
const SQL_DATABASE=process.env.SQL_DATABASE;
const SQL_ENCRYPT = process.env.SQL_ENCRYPT === "true";

module.exports = async function (context, req) {

    const config = {
        server: SQL_SERVER,
        user: SQL_USER,
        password: SQL_PASS,
        database: SQL_DATABASE,
        options: {
            encrypt: SQL_ENCRYPT,
            trustedConnection: !SQL_ENCRYPT,
            enableArithAbort: true
        }
    }

    try {

        const pool = await sql.connect(config);

        const request = pool.request();
        
        var response = await request.query("SELECT * FROM dbo.Accounts Where Email=hwh");

        pool.close();

    } catch (err) {

        context.log(err);
        
    }

    if( response === undefined ) {

        // return incorect username or password

    } else {

        // return Token + Redirected Webpage

    }

    



   
}