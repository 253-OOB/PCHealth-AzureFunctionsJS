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

You can download the Azure Storage Explorer from the following URL: https://azure.microsoft.com/en-us/features/storage-explorer/

## Setting up the environment: (in order)

### Install Dependencies:

Run `npm install -g recursive install`

Run `npm-recursive-install` (At the root directory)

### Additional Requirments:

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

### Run a single application:

Change directory to the application you want to run: `cd <desired function directory>`

Start the application: `func host start`

### Start all function at the same time:

1 - Press the debug button in VSCode.
2 - Press the dropdown at the top, and select `Launch All Functions`
3 - Press the run button