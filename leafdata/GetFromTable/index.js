
var alasql = require("alasql");

module.exports = async function (context, req) {

    var tableData = context.bindings.tableBinding;

    for(var i=0; i<tableData.length; i++) {
        tableData[i]["RowKey"] = parseInt(tableData[i]["RowKey"]);
    }

    var pkToReturn = alasql(`
        SELECT PartitionKey, MAX(RowKey) as RowKey FROM ? Group By PartitionKey
        `,
        [tableData]
    );

    var result = alasql(`
        SELECT PartitionKey as LEAFNAME, RowKey as TIMESTAMP, ProcessorLoad as PROCESSORLOAD, RAMUsage as RAMUSAGE, DiskUsage as DISKUSAGE 
        FROM ? as t1
        INNER JOIN ? as t2
        ON t1.PartitionKey = t2.PartitionKey AND t1.RowKey = t2.RowKey
        `,
        [tableData, pkToReturn]
    );

    context.res.body = result;

}
