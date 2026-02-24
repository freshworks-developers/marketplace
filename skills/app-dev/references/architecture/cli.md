>title: Detailed instructions for Installing the Freshworks CLI
>tags: cli, fdk, instructions
>context: 
>content:

# Detailed instructions for Installing the Freshworks CLI

For detailed instructions to install the Freshworks CLI, kindly follow the steps available [here](http://freshworks.dev/docs/app-sdk/v3.0/common/app-development-process/#install-the-fdk-+-cli)

---
>title: Install the Freshworks CLI
>tags: cli, fdk, commands
>context: 
>content:

# Install the Freshworks CLI

## Steps
1. Ensure to use npm for CLI installation. Also, ensure to use the npm version that is shipped with Node.
2. If you already have Freshworks CLI installed, then uninstall the previous CLI versions:
    ```sh
    npm uninstall fdk -g
    ```
3. To install the global app CLI version, run the following command:
    ```sh
    npm install https://cdn.freshdev.io/fdk/v9.1.0-beta.tgz -g
    ```
4. Verify the CLI installation using `fdk version`

---
>title: what are Freshworks CLI commands
>tags: cli, fdk, commands
>context: 
>content:

# what are Freshworks CLI commands

## Overview
The Freshworks CLI enables you to build, test and publish apps on Freshworks Developer Platform. To view the list of CLI commands, after you install the CLI, from the command prompt run `fdk --help`. It will give the list of available commands.

## Syntax
The FDK commands follow a syntax as depicted below

`fdk [global-flag] [command] [command-flags] [arguments]`

## General Commands
The general commands are `create`, `generate`, `run`, `validate`, `pack`, `version`, `search`, `test`, `help` with options such as `-v`, `--version`, `-u`, `--skip-update-check`, `-d`, `--app-dir [directory]`, `-h` or `--help`

---
>title: the command help section for fdk
>tags: cli, fdk, commands
>context: 
>content:

# the command help section for fdk

## To view the information about a CLI command

Run the following command `fdk COMMAND (-h | --help)`

## Example
To get help on FDK Create command use `fdk create --help`

### Example Commands
```sh
$ fdk create
$ fdk create --template common-starter-template
$ fdk create --app-dir ./myfirstapp --template serverless-starter-template
```

---
>title: how to get detailed logs or skip version updates
>tags: cli, fdk, commands, logs
>context: 
>content:

# how to get detailed logs or skip version updates

## Version Update Check
When you run the Freshworks CLI commands, if no version update check has run in the last 24 hours, the FDK:
1. Checks whether a new FDK version is available.
2. If a new version is available and if you are not on the latest version, displays an update prompt that enables you to move to the latest version.
3. Keeps track of the update check time.

## Obtain Detailed Logs
To obtain detailed logs, run the following command
```sh
# debug logs
NODE_DEBUG=fdk fdk COMMAND

# skip the update prompt
fdk < -u or --skip-update-check> <COMMAND>
# Example 1
fdk --skip-update-check create
# Example 2
fdk -u run
```

---
>title: The Create Command
>tags: cli, fdk, commands
>context: 
>content:

# The Create Command

## Overview
The command creates an app in the specified directory, based on the default app template. To build a global app, ensure `fdk config set --scope local global_apps.enabled true`. If no directory is specified, the app is created in the current directory. Ensure that the directory in which the app is to be created is empty. You can learn more details in the [documentation](http://freshworks.dev/docs/app-sdk/v3.0/common/basic-dev-tools/freshworks-cli/#create).

### Example Commands
```sh
fdk create --template <template>
# Example 1 - create app for freshdesk with your_first_app app template
fdk create --template common-starter-template
# Example 2 - create app in the current directory with app directory name being myfirstapp
fdk create --app-dir ./myfirstapp --template serverless-starter-template
# Example 3 - create app for with name myfirstapp under location /Users/user/myfirstapp
fdk create --app-dir /Users/user/myfirstapp --template serverless-starter-template
```

---
>title: The FDK CLI Generate Command and its attributes
>tags: cli, fdk, commands
>context: 
>content:

# The FDK CLI Generate Command and its attributes

## Overview
This command is used to generate app files with a specific template for an existing app that was created by using the `fdk create` command.

The list of following files is displayed. Select a file and enter the appropriate parameter values. The corresponding file is generated based on the values.
- `oauth_config.json`: Contains the configuration parameters, such as client_id, client_secret, authorize_url, token_url, and account/agent scope, required for OAuth-based authentication.
- `iparams.json`: Contains the installation parameters, such as iparam name and type of iparam, whose values are set when the app is installed.
- `iparams.html`: Contains the html code to build the Custom Installation page. You can enter the page title, select the product css to link, and choose to add jquery, fresh_client.js, and iparam.js and iparam.css.
- `server.js`: Contains the event registration and callback methods. You need to enter the names of the events and callback functions.
- `manifest.json`: Selecting this option enables you to reconfigure the default App Manifest that is created as part of the app creation using `common-starter-template` or `serverless-starter-template`. You can select modules, select and add corresponding placeholders from the list of placeholders displayed for the selected module, select and add corresponding product events from the list of serverless events displayed for the selected module.

## Command
After you create an app, run the following command to generate app files such as `iparams.json` etc with specific template
```sh
fdk generate
```

---
>title: The `fdk run` command to run and test an app
>tags: cli, fdk, commands, run
>context: 
>content:

# The `fdk run` command to run and test an app

## Overview
The `fdk run` command is used to start the local server in order to test your app. If you are running a serverless app that contains dependencies, the packages defined in `manifest.json` are automatically installed.
Once you exit testing, the CLI prints a summary of how extensive your testing was. Each component in the coverage summary should be at least 80% for apps to be submitted in Freshworks Marketplace. See [Code coverage](https://freshworks.dev/docs/app-sdk/v3.0/common/app-development-guidelines/code-guidelines/#code-coverage) for more information.

### Command
```sh
fdk run [--app-dir DIR]
# Example 1
fdk run
# Output for Example 1
Starting local testing server at http://*:10001/
Append "dev=true" to your Freshdesk support URL to start testing
e.g. https://domain.freshdesk.com/helpdesk/tickets/1?dev=true
Quit the server with Control-C.

# Example 2
fdk run --app-dir /Users/user/myfirstapp
```

## In Development Mode
Open the respective page of the Freshworks products to open the app. Add `?dev=true` query parameter to the URL to view the locally running and in-development apps.

---
>title: Run fdk in local with configured request time out
>tags: cli, fdk, request, run
>context: 
>content:

# Run fdk in local with configured request time out

## Configuring Request Timeout
Specify the time in milliseconds after which a [Request Method](http://freshworks.dev/docs/app-sdk/v3.0/common/advanced-interfaces/request-method/) call times out during local testing.
- Minimum Value: 15000
- Maximum Value: 30000
If you specify a `REQUEST_TIMEOUT` value that breaches the min or max limits, the timeout is defaulted to the min or max value and a warning message is displayed.

### Command
```sh
[REQUEST_TIMEOUT=<timeout in milliseconds>] fdk run

# Example 1
REQUEST_TIMEOUT=20000 fdk run
```

---
>title: The fdk validate command
>tags: cli, fdk, commands
>context: 
>content:

# The fdk validate command

## Overview
This command validates whether the app code is error free. If there are errors in the code, corresponding violations are displayed after the command is run.

### Command
```sh
fdk validate [--app-dir DIR] [--fix]

# example 1 - When validating an app, the option fixes all lint errors for which auto-fix support is available.
fdk validate -fix
```

---
>title: Conditions of validate command
>tags: cli, fdk-validate, commands, validate
>context: 
>content:

# Conditions of validate command

## When Validate Command is Used with Node 14 and Above
1. The `fdk validate` command when used with Node 14 and above, it displays a warning message and a prompt asking whether you want to continue. If you continue with the validation, the FDK:
   - It Deletes the existing `coverage` folder containing the results of the `fdk run` command used to set up the local server and test an app.
   - It Deletes the `node_modules` folder containing the npm dependencies specified in manifest.json
   - Includes or updates the engines attribute in manifest.json. The updated engines.node and engines.fdk values reflect the Node.js and FDK versions on which the app is validated.
2. After a successful validation, ensure to retest the app by using the `fdk run` command. The retesting generates the coverage folder and the coverage summary required to pack your app for submission.
3. If there is a minor Node.js version mismatch between the version used to build the app and the current Node.js runtime version, the FDK automatically updates `manifest.json > engines.node` to reflect the Node.js version on which the app is validated.

---
>title: how to pack or bundle your application
>tags: cli, fdk, commands, pack
>context: 
>content:

# how to pack or bundle your application

## Overview
The `fdk pack` command creates an app package file that can be submitted for the app review process.

### Command
```sh
fdk pack --app-dir [DIR]

# example 1 - generate app bundle for app named myFirstApp located under user directory using fdk pack command
fdk pack -d /user/myFirstApp
```

---
>title: Usage of version check, search, test
>tags: cli, fdk, commands, check, search, test
>context: 
>content:

# Usage of version check, search, test

## Version Command
- `fdk version` command prints the installed and latest CLI versions.

## Search Command
- The `fdk search` command prints the installed and latest CLI versions.

## Test Command
- The FDK includes a testing framework (currently in beta) to help test serverless apps. This enables you to write and maintain unit tests as part of app files. The test command runs these unit tests. Use `fdk test` to test your app test cases from CLI

### Commands
```sh
fdk search [query-string]

# Example 1
fdk search "Serverless app"

# test (beta)
fdk test
```

---

