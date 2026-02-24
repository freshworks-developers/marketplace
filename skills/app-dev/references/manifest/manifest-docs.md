>title: how to configure manifest and register smi functions?
>tags: manifest
>context: manifest.json
>code:

# How to configure manifest and register SMI functions?

After creating a serverless app’s files, to configure the app manifest for an SMI app , from the app’s root directory, navigate to manifest.json.

```json
{
  "platform-version": "3.0",
  "modules": {
    "common": {
      "events": {
        "onAppInstall": {
          "handler": "onAppInstallHandler"
        },
        "onAppUninstall": {
          "handler": "onAppUninstallHandler"
        }
      },
      "requests": {
        "requestMethod1": {},
        "requestMethodName2": {}
      },
      "functions": {
        "serverMethodName1": {},
        "serverMethodName2": {}
      }
    },
    "deal": {
      "location": {
        "deal_entity_menu": {
          "url": "template.html",
          "icon": "logo.svg"
        }
      },
      "events": {
        "onDealCreate": {
          "handler": "onDealCreateHandler"
        }
      }
    }
  },
  "engines": {
    "node": "18.16.0",
    "fdk": "9.1.0"
  },
  "dependencies": {
    "nodemon": "1.14.12"
  }
}
```

---

>title: what is the platform version attribute in manifest file in Freshworks apps?
>tags: manifest
>context: manifest.json
>code:

# What is the platform version attribute in manifest file in Freshworks apps?

Platform version you use to build the app. This value is auto-generated when you create the default app files by using the fdk create command.

```json
{
  "platform-version": "2.3",
  "product": {
    "freshdesk": {
      "location": {
        "ticket_sidebar": {
          "url": "template.html",
          "icon": "logo.svg"
        }
      },
      "requests": {
        "createTicket": {},
        "getTickets": {}
      }
    }
  },
  "engines": {
    "node": "18.17.1",
    "fdk": "9.0.4"
  }
}
```

---

>title: What is the product attribute in manifest file in freshworks apps?
>tags: manifest
>context: manifest.json
>code:

# What is the product attribute in manifest file in Freshworks apps?

It associates a Freshworks product with the information that is necessary to render the app on the specified product. It has product name as a child attribute, which contains the name of the product for which you are building the app. This value is auto-generated when you create the default app files by using the fdk create command.

```json
{
  "platform-version": "2.3",
  "product": {
    "freshdesk": {
      "location": {
        "ticket_sidebar": {
          "url": "template.html",
          "icon": "logo.svg"
        }
      },
      "requests": {
        "createTicket": {},
        "getTickets": {}
      }
    }
  },
  "engines": {
    "node": "18.17.1",
    "fdk": "9.0.4"
  }
}
```
---

>title: What is the engines attribute in manifest file in freshworks apps?
>tags: manifest
>context: manifest.json
>code:

# What is the engines attribute in manifest file in Freshworks apps?

The `engines` attribute specifies the Node.js and FDK versions used to build the app. This value is auto-populated when you create the app files using the `fdk create` command.

## Creating an App

If you use FDK 7.0.0 or later, the `engines` attribute is included by default in `manifest.json`.

## Migrating an App

For apps built with FDK 6.x.x or earlier:

1. Install the latest FDK version.
2. Run `fdk validate` to update the `engines` attribute.
3. Retest the app.

```json
{
  "platform-version": "2.3",
  "product": {
    "freshdesk": {
      "location": {
        "ticket_sidebar": {
          "url": "template.html",
          "icon": "logo.svg"
        }
      },
      "requests": {
        "createTicket": {},
        "getTickets": {}
      }
    }
  },
  "engines": {
    "node": "18.17.1",
    "fdk": "9.0.4"
  }
}
```

---
>title: What is the dependecies attribute in manifest file in freshworks apps?
>tags: manifest
>context: manifest.json
>code:

# What is the dependecies attribute in manifest file in Freshworks apps?

All npm packages that the app uses, specified as <npm-package-name>:<version> pairs in manifest. This attribute is not a default attribute. If your app uses npm packages, in manifest.json, include this dependencies attribute and register the packages as dependencies. It is mostly used in serverless apps.

```json
{
  "platform-version": "2.3",
  "product": {
    "freshdesk": {
      "location": {
        "ticket_sidebar": {
          "url": "template.html",
          "icon": "logo.svg"
        }
      },
      "requests": {
        "createTicket": {},
        "getTickets": {}
      }
    }
  },
 "dependencies": {
      "nodemon": "1.14.12"
  },
  "engines": {
    "node": "18.17.1",
    "fdk": "9.0.4"
  }
}
```
