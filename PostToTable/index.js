module.exports = async function (context, req) {

    context.log('Request [POST] received.');
  
    data = JSON.parse(req.body);

    context.log(data);
    
    context.bindings.tableBinding = [];

    context.bindings.tableBinding.push({
        PartitionKey: data["LEAFNAME"],
        RowKey: "" + data["TIMESTAMP"],
        ProcessorLoad: data["PROCESSORLOAD"][0]["VALUE"],
        RAMUsage: data["RAMUSAGE"][0]["VALUE"],
        DiskUsage: data["DISKUSAGE"][0]["VALUE"]
    });

    context.done();

}