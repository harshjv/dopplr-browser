# Dopplr

> Ethereum for humans!

Visit https://dopplr.io


## What is Dopplr?

> Think Dopplr as [Metamask](https://metamask.io/) minus chrome extension plus identity provider.

Dopplr is an extensible & cross-platform Ethereum browser. Using `iframe` and `window.postMessage`, it provides a secure way of signing data while keeping *encrypted* private key in `localStorage` or somewhere in a remote location.


## Architecture

1. DApp developer embeds Dopplr-Web3 library (https://dopplr.io/web3.js) with the DApp.
2. When DApp is loaded using Dopplr-browser (inside an `iframe`), `Dopplr-Web3` will connect to parent web3-provider.
3. `iframe-messenger` routes all the RPC and signing calls to Dopplr-browser, and then again redirected back to DApp upon result.
4. Dopplr-browser contains Dopplr-UI which handles signing requests through intermediate OTP provider (optional).
5. Up on successful authentication, the signed data is passed back to the DApp, otherwise an authentication error is thrown.


[![Architecture Diagram](./arch.png)](http://www.nomnoml.com/#view/%5B%3Cactor%3Euser%5D%0A%0A%5Buser%5D%3C-%3E%5Bdopplr-browser%5D%0A%0A%5Bdopplr-browser%7C%0A%20%20%5Bswitch-network%5D%0A%5D%0A%0A%5Buser%5D%3C%3A--%3A%3E%5Bdopplr-ui%5D%0A%5Buser%5D%3C%3A--%3A%3E%5Bweb%20dapp%5D%0A%0A%5Brpc%20%7C%0A%20%20%5Bethereum%20blockchain%20%7C%0A%20%20%20%20%5Bcontracts%5D%0A%20%20%20%20%5Baccounts%5D%0A%20%20%5D%0A%5D%0A%0A%5Bdopplr-ui%7C%0A%20%20%20%5Btx-modal%5D%0A%20%20%20%5Btools%7C%0A%20%20%20%20%20vue%0A%20%20%20%20%20ethUtils%0A%20%20%20%5D%0A%20%20%20%5Bcomponents%7C%0A%20%20%20%20%20%5Botp-provider%7C%0A%20%20%20%20%20telegram*%5D%0A%20%20%20%20%20%5Btx-describer%5D%0A%20%20%20%5D%0A%20%20%20%5Bactions%7C%0A%20%20%20%20%20tx-manager%0A%20%20%20%5D%0A%20%20%20%5Bcomponents%5D%3A-%3E%5Bactions%5D%0A%20%20%20%5Bactions%5D%3A-%3E%5Bcomponents%5D%0A%5D%0A%0A%5Biframe-messenger%5D%3C-%3E%5Bdopplr-browser%5D%0A%0A%5Bweb%20dapp%7C%0A%20%20%5B%3Cactor%3Eui%20developer%5D%0A%20%20%5Bui%20developer%5D-%3E%5Bui%20code%5D%0A%20%20%5Bui%20code%5D%3C-%3E%5Bweb3%5D%0A%20%20%5Bweb3%5D%3C-%3E%5Bdopplr-web3%7C%0A%20%20%5Bprovider-engine%7C%0A%20%20%20%20dopplr-wallet-provider%0A%20%20%20%20dopplr-rpc-provider%5D%0A%20%20%5D%0A%5D%0A%0A%5Bweb%20dapp%5D%3C-%3E%5Biframe-messenger%5D%0A%5Bdopplr-browser%5D%3C-%3E%5Brpc%5D%0A%5Bdopplr-browser%5D%3C-%3E%5Bdopplr-ui%5D%0A)



### Demo

1. Visit https://dev.dopplr.io/harshjv
  - this end point (/harshjv) is configured with;
    - Telegram as OTP provider
    - a remote server as encrypted private key provider
2. Browse any Dopplr-compatible DApp
3. Do any destructive action
4. For development/test environment, OTP is `123456` and password is `1234`


## License

MIT
