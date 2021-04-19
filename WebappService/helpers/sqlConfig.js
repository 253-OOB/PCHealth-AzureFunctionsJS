

const sql = require("mssql");
const dotenv = require("dotenv").config({path:__dirname+'/./../.env'});


module.exports.BigInt = () => { return sql.BigInt};
module.exports.Binary = () => { return sql.Binary };
module.exports.Bit = () => { return sql.Bit };
module.exports.Char = () => { return sql.Char };
module.exports.Date = () => { return sql.Date };
module.exports.DateTime = () => { return sql.DateTime };
module.exports.Decimal = () => {return  sql.Decimal };
module.exports.Float = () => { return sql.Float };
module.exports.Int = () => { return sql.Int };
module.exports.NChar = () => { return sql.NChar };
module.exports.NVarChar = () => { return sql.NVarChar };

const sqlconfig = {
    server: process.env.SQL_SERVER,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    database: process.env.SQL_DATABASE,
    options: {
        encrypt: (process.env.SQL_ENCRYPT === "true"),
        trustedConnection: !(process.env.SQL_ENCRYPT === "true"),
        enableArithAbort: true
    }
}

module.exports.query = async ( query_string, inputs ) => {

    let sql_response = undefined;

    try {
        
        const pool = await sql.connect(sqlconfig);

        const request = pool.request();

        for( let i=0; i<inputs.length; i++ ) {
            request.input(inputs[i].name, (inputs[i].type) (), inputs[i].value);
        }

        console.log(query_string);

        sql_response = await request.query(query_string);

        pool.close();

        if(sql_response.rowsAffected == 1) {
            return {
                status: 200,
                rows: sql_response.rowsAffected,
                data: sql_response.recordset
            }
        } else {

            console.log(inputs);
            return { status: 500 }
        }

    } catch (err) {

        console.log(err);
        return {status: 500};
        
    }

};