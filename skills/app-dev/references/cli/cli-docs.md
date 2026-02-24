>title: Configure request timeout for longer API requests in local
>tags: cli, fdk, request, run
>context: FDK
>content:

# Configure request timeout for longer API requests in local
When the request method invokes APIs that are slow and require longer timeouts beyond 15s, this can be requested with dev-assist ticket but to test it locally would reqiure to configure the timeout during runtime with FDK.

## Configuring request timeout with FDK run
Specify the time in milliseconds after which a Request Method call times out during local testing.

While configuring the request timeout locally, the valid values for timeout are 15000 (default value), 20000, 25000 and 30000.
If you specify a `REQUEST_TIMEOUT` value that breaches the min or max limits, the timeout is defaulted to the min or max value and a warning message is displayed. 

```sh
[REQUEST_TIMEOUT=<timeout in milliseconds>] fdk run
```

## Configuring 20s request timeout
```sh
REQUEST_TIMEOUT=20000 fdk run
```
---