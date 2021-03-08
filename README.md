# PCHealth-AzureFunctionsJS

## Project Requirements

* VSCode

Install the following extension: 
    - Azure Functions
    - Azure Storage

* NodeJS (v. >= 14.15.5)

You can download nodejs from the followinf URL: https://nodejs.org/en/

* .NET SDK (Specify version) (You probably already have it)

* Azure Functions Core Tools

`npm i -g azure-functions-core-tools@3 --unsafe-perm true`

* Azure Storage Explorer:

You can download the Azure Storage Emulator from the following URL: https://azure.microsoft.com/en-us/features/storage-explorer/

## Setting up the environment:

Run `npm install`

Add a file called local.settings.json in the main folder. Paste the following inside it:

```JSON
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "StorageConnectionString": "UseDevelopmentStorage=true"
  }
}
```

## Run the Project

Go to search and run in windows and type: `Azure Storage Emulator`

This will automatically start the storage emulator.

Run in the terminal `func host start`.
