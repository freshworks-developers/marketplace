>title: What FDK CLI generate command options
>tags: cli, fdk, instructions
>context: 
>content:

# What FDK CLI generate command options

The `fdk generate` command is used to generate app files with a specific template for an existing app that was created by using the `fdk create` command.

## Available Files

The following files can be generated. Select a file and enter the appropriate parameter values. The corresponding file is generated based on the values.

- `oauth_config.json`: Contains the configuration parameters.
- `iparams.json`: Contains the installation parameters.
- `iparams.html`: Contains the html code to build the Custom Installation page.
- `server.js`: Contains the event registration and callback methods.
- `manifest.json`: Enables you to reconfigure the default App Manifest created using the `common-starter-template` or `serverless-starter-template`. You can select modules, placeholders, and product events.

---
>title: How to use fdk generate to generate oauth_config.json
>tags: cli, fdk, instructions
>context: oauth_configs.json
>content:

# How to use fdk generate to generate oauth_config.json

## Steps

1. Ensure you have global apps enabled via `fdk config set --scope local global_apps.enabled true`.
2. Run the command `fdk generate` to invoke generate options.
3. Select `oauth_config.json` from the list using arrow keys.
4. Set up the OAuth configuration file by entering the values for `client_id`, `client_secret`, `authorize_url`, `token_url`, and `token_type` (Account or Agent).

### Example Input

```sh
? Select file to be generated oauth_config.json
? Enter oauth name <Enter OAuth Name 1>
? Enter oauth display name <Enter OAuth Display Name 1>
? Enter client_id <Enter OAuth Client ID>
? Enter client_secret <Enter OAuth Client Secret>
? Enter authorize_url <Enter OAuth Authorize URL>
? Enter token_url <Enter OAuth Token URL>
? Select token_type <Select Account or Agent>
? Want to enter another oauth (just hit enter for YES)? Yes
? Enter oauth name 
```

### Example Output

```json
{
    "integrations": {
        "oauth_name1": {
            "display_name": "oauth_name1_display_name",
            "client_id": "oauth_name1_clientId",
            "client_secret": "oauth_name1_secret",
            "authorize_url": "oauth_name1_authorize_url",
            "token_url": "oauth_name1_token_url",
            "token_type": "account"
        }
    }
}
```

5. You can add OAuth configs for different systems as applicable.

---
>title: How to use fdk generate to generate iparams.json
>tags: cli, fdk, instructions
>context: iparams.json
>content:

# How to use fdk generate to generate iparams.json

## Steps

1. Ensure you have global apps enabled via `fdk config set --scope local global_apps.enabled true`.
2. Run the command `fdk generate` to invoke generate options.
3. Select `iparams.json` from the list using arrow keys.
4. Create installation parameters via command console inputs.

### Example Input

```sh
? Select file to be generated iparams.json
? Do you want to overwrite the current file (just hit enter for NO)? Yes
? Enter iparam name <iparam1>
? Select Type of iparam <iparam1_type>
? Choose Supported modules (just hit enter for all modules): <select modules via arrow and spaces and hit enter>
? Want to enter another iparam (just hit enter for YES)? Yes
? Enter iparam name <iparam2>
? Select Type of iparam <iparam2_type>
? Choose Supported modules (just hit enter for all modules): <select modules via arrow and spaces and hit enter>
? Want to enter another iparam (just hit enter for YES)? Yes
? Enter iparam name <iparam3>
? Select Type of iparam <iparam3_type>
? Choose Supported modules (just hit enter for all modules): <select modules via arrow and spaces and hit enter>
? Want to enter another iparam (just hit enter for YES)? No
? Want to add iparam.js (just hit enter for YES)? Yes
```

### Example Output

```json
{
    "<iparam1>": {
        "display_name": "<iparam1>",
        "description": "Please enter your <iparam1>",
        "type": "dropdown",
        "required": true,
        "options": [
            "opt1",
            "opt2",
            "opt3"
        ],
        "default_value": "opt1"
    },
    "<iparam2>": {
        "display_name": "<iparam2>",
        "description": "Please enter your sfgf",
        "type": "dropdown",
        "required": true,
        "modules": [
            "email_conversation",
            "support_ticket",
            "support_contact"
        ],
        "options": [
            "opt1",
            "opt2",
            "opt3"
        ],
        "default_value": "opt1"
    },
    "<iparam3>": {
        "display_name": "<iparam3>",
        "description": "Please enter your <iparam3>",
        "type": "multiselect",
        "required": true,
        "modules": [
            "support_email",
            "email_conversation",
            "support_ticket"
        ],
        "options": [
            "opt1",
            "opt2",
            "opt3"
        ],
        "default_value": [
            "opt1",
            "opt2"
        ]
    },
    "<iparam4>": {
        "display_name": "<iparam4>",
        "description": "Please enter your <iparam1>",
        "type": "checkbox",
        "required": true,
        "modules": [
            "support_email",
            "deal",
            "cpq_document"
        ],
        "default_value": true
    }
}
```

5. You can add iparams information and types as applicable.

---
>title: How to use fdk generate to generate iparams.html
>tags: cli, fdk, instructions
>context: iparams.js
>content:

# How to use fdk generate to generate iparams.html

## Steps

1. Ensure you have global apps enabled via `fdk config set --scope local global_apps.enabled true`.
2. Run the command `fdk generate` to invoke generate options.
3. Select `iparams.html` from the list using arrow keys.
4. Create installation parameters page via command console inputs.

### Example Input

```sh
? Select file to be generated iparams.html
? Enter page title <page-title>
? Want to add jquery (just hit enter for YES)? Yes
? Want to add <page-title>.js and <page-title>.css (just hit enter for YES)? Yes
```

### Example Output

```html
<html>
<head>
<title>iparam.html</title>
<link rel='stylesheet' type='text/css' href='https://static.freshdev.io/fdk/2.0/assets/freshworks.css'>
<link rel="stylesheet" type="text/css" href="./assets/<page-title>.css">
<style>
/* Put your custom style here */
</style>
</head>
<body>
<div class='form'>
<form>
    <input type='text' name='field1' placeholder='Your Name' />
    <input type='email' name='field2' placeholder='Email Address' />
</form>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
<script src="{{{appclient}}}"></script>
<script src="./assets/<page-title>.js"></script>
<script type= "text/javascript">
function getConfigs(configs) {
//write your code here
};

function validate() {
let isValid = true;
//write your code here
return isValid;
};

function postConfigs() {
//write your code here
};
</script>
</body>
</html>
```

5. You can add information and types as applicable.

---
>title: How to use fdk generate to generate manifest.json
>tags: cli, fdk, instructions, manifest
>context: manifest.json
>content:

# How to use fdk generate to generate manifest.json

## Steps

1. Ensure you have global apps enabled via `fdk config set --scope local global_apps.enabled true`.
2. Run the command `fdk generate` to invoke generate options.
3. Select `manifest.json` from the list using arrow keys.
4. Create `manifest.json` with desired modules and its placeholders with event selection.

### Example Input

```sh
? Select file to be generated manifest.json
? Do you want to overwrite the current file (just hit enter for NO)? Yes
? Choose module: common
? Add placeholders? Yes
? Choose placeholders: full_page_app, left_nav_cti
? Add serverless events? Yes
? Choose serverless events: onAppInstall, onAppUninstall
? Want to add another module (just hit enter for YES)? Yes
? Choose module: support_email
? Add placeholders? Yes
? Choose placeholders: new_email_requester_info
? Add serverless events? 
? Want to add another module (just hit enter for YES)? Yes
? Choose module: support_ticket
? Add placeholders? Yes
? Choose placeholders: ticket_sidebar, ticket_requester_info
? Add serverless events? Yes
? Choose serverless events: onTicketCreate, onTicketUpdate, onTicketDelete
? Want to add another module (just hit enter for YES)? Yes
? Choose module: deal
? Add placeholders? Yes
? Choose placeholders: deal_entity_menu
? Add serverless events? Yes
? Choose serverless events: onDealCreate, onDealUpdate
? Want to add another module (just hit enter for YES)? No
```

### Example Output

```json
{
    "platform-version": "3.0",
    "modules": {
        "common": {
            "location": {
                "full_page_app": {
                    "url": "index.html",
                    "icon": "styles/images/icon.svg"
                },
                "left_nav_cti": {
                    "url": "index.html",
                    "icon": "styles/images/icon.svg"
                }
            },
            "events": {
                "onAppInstall": {
                    "handler": "onAppInstallHandler"
                },
                "onAppUninstall": {
                    "handler": "onAppUninstallHandler"
                }
            }
        },
        "support_email": {
            "location": {
                "new_email_requester_info": {
                    "url": "index.html",
                    "icon": "styles/images/icon.svg"
                }
            }
        },
        "support_ticket": {
            "location": {
                "ticket_sidebar": {
                    "url": "index.html",
                    "icon": "styles/images/icon.svg"
                },
                "ticket_requester_info": {
                    "url": "index.html",
                    "icon": "styles/images/icon.svg"
                }
            },
            "events": {
                "onTicketCreate": {
                    "handler": "onTicketCreateHandler"
                },
                "onTicketUpdate": {
                    "handler": "onTicketUpdateHandler"
                },
                "onTicketDelete": {
                    "handler": "onTicketDeleteHandler"
                }
            }
        },
        "deal": {
            "location": {
                "deal_entity_menu": {
                    "url": "index.html",
                    "icon": "styles/images/icon.svg"
                }
            },
            "events": {
                "onDealCreate": {
                    "handler": "onDealCreateHandler"
                },
                "onDealUpdate": {
                    "handler": "onDealUpdateHandler"
                }
            }
        }
    },
    "engines": {
        "node": "18.17.0",
        "fdk": "9.1.0"
    }
}
```

5. You can add information and types as applicable.

---
>title: How to use fdk generate to generate server.js
>tags: cli, fdk, instructions, server
>context: server.js
>content:

# How to use fdk generate to generate server.js

## Steps

1. Ensure you have global apps enabled via `fdk config set --scope local global_apps.enabled true`.
2. Ensure you have an existing `manifest.json` with at least one module else you will receive error `At least one module must be present in the manifest.json for platform version >= 3.0`.
3. Run the command `fdk generate` to invoke generate options.
4. Select `server.js` from the list using arrow keys.
5. Create `server.js` with desired modules and its placeholders with event selection.

### Example Input

```sh
? Select file to be generated server.js
? Select Module: common
? Choose event name: onAppInstall
? Enter handler function name (just hit enter to autofill): onAppInstallHandler
? Want to enter another event (just hit enter for YES)? Yes
? Select Module: common
? Choose event name: afterAppUpdate
? Enter handler function name (just hit enter to autofill): afterAppUpdateHandler
? Want to enter another event (just hit enter for YES)? Yes
? Select Module: support_ticket
? Choose event name: onTicketCreate
? Enter handler function name (just hit enter to autofill): onTicketCreateHandler
? Want to enter another event (just hit enter for YES)? Yes
? Select Module: support_ticket
? Choose event name: onTicketUpdate
? Enter handler function name (just hit enter to autofill): onTicketUpdateHandler
? Want to enter another event (just hit enter for YES)? Yes
? Select Module: deal
? Choose event name: onDealCreate
? Enter handler function name (just hit enter to autofill): onDealCreateHandler
? Want to enter another event (just hit enter for YES)? No
```

### Example Output

```js
exports = {

// args is a JSON block containing the payload information.
// args['iparam'] will contain the installation parameter values.

onAppInstallHandler: function(args) {
        console.info('onAppInstallHandler invoked with following data: \n', args);
        renderData();
    },
afterAppUpdateHandler: function(args) {
        console.info('afterAppUpdateHandler invoked with following data: \n', args);
        renderData();
    },
onTicketCreateHandler: function(args) {
          console.log('Hello ' + args['data']['requester']['name']);
      },
onTicketUpdateHandler: function(args) {
          console.log('Hello ' + args['data']['requester']['name']);
      },
onDealCreateHandler: function(args) {
          console.log('Hello ' + args['data']['requester']['name']);
      },

};
```

6. You can add information and types as applicable.

---