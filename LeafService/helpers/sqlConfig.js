

const sql = require("mssql");
const dotenv = require("dotenv").config({path:__dirname+'/./../.env'});

module.exports.BigInt = sql.BigInt;
module.exports.Binary = sql.Binary;
module.exports.Bit = sql.Bit;
module.exports.Char = sql.Char;
module.exports.Date = sql.Date;
module.exports.DateTime = sql.DateTime;
module.exports.Decimal = sql.Decimal;
module.exports.Float = sql.Float;
module.exports.Int = sql.Int;
module.exports.NChar = sql.NChar;
module.exports.NVarChar = sql.NVarChar;

const sqlconfig = {
    server: process.env.SQL_SERVER,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    database: process.env.SQL_DATABASE,
    options: {
        encrypt: (process.env.SQL_ENCRYPT === true),
        trustedConnection: !(process.env.SQL_ENCRYPT === true),
        enableArithAbort: true
    }
}

module.exports.query = async ( query_string, inputs ) => {

    let sql_response = undefined;

    try {
        
        const pool = await sql.connect(sqlconfig);

        const request = pool.request();

        // TODO Change Refresh token name in database from Refresh_Token to RefreshToken

        for( let i=0; i<inputs.length; i++ ) {
            request.input(inputs.name, inputs.type, inputs.value);
        }


        sql_response = await request.query(query_string);

        pool.close();

        return sql_response;

    } catch (err) {

        // console.error(err);
        return {status: 500};
        
    }

};