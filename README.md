# Dopplr

> Ethereum for humans!

Visit https://dopplr.io


## Architecture

[![Architecture Diagram](./arch.png)](http://www.nomnoml.com/#view/%5B%3Cactor%3Euser%5D%0A%0A%5Buser%5D%3C%3A--%3A%3E%5Bdopplr-ui%5D%0A%5Buser%5D%3C-%3E%5Bdopplr-browser%5D%0A%5Buser%5D%3C%3A--%3A%3E%5Bweb%20dapp%5D%0A%0A%0A%5Bdopplr-ui%7C%0A%20%20%20%5Btx-modal%5D%0A%20%20%20%5Btools%7C%0A%20%20%20%20%20vue%0A%20%20%20%20%20ethUtils%0A%20%20%20%5D%0A%20%20%20%5Bcomponents%7C%0A%20%20%20%20%20%5Botp-provider%7C%0A%20%20%20%20%20telegram*%5D%0A%20%20%20%20%20%5Btx-describer%5D%0A%20%20%20%5D%0A%20%20%20%5Bactions%7C%0A%20%20%20%20%20tx-manager%0A%20%20%20%5D%0A%20%20%20%5Bcomponents%5D%3A-%3E%5Bactions%5D%0A%20%20%20%5Bactions%5D%3A-%3E%5Bcomponents%5D%0A%5D%0A%0A%5Bweb%20dapp%7C%0A%20%20%5B%3Cactor%3Eui%20developer%5D%0A%20%20%5Bui%20developer%5D-%3E%5Bui%20code%5D%0A%20%20%5Bui%20code%5D%3C-%3E%5Bweb3%5D%0A%20%20%5Bweb3%5D%3C-%3E%5Bdopplr-web3%7C%0A%20%20%5Bprovider-engine%7C%0A%20%20%20%20dopplr-wallet-provider%0A%20%20%20%20dopplr-rpc-provider%5D%0A%20%20%5D%0A%5D%0A%0A%5Biframe-messenger%5D%3C-%3E%5Bdopplr-browser%5D%0A%0A%5Bdopplr-browser%7C%0A%20%20%5Bswitch-network%5D%0A%5D%0A%0A%5Brpc%20%7C%0A%20%20%5Bethereum%20blockchain%20%7C%0A%20%20%20%20%5Bcontracts%5D%0A%20%20%20%20%5Baccounts%5D%0A%20%20%5D%0A%5D%0A%0A%5Bweb%20dapp%5D%3C-%3E%5Biframe-messenger%5D%0A%0A%5Bdopplr-browser%5D%3C-%3E%5Bdopplr-ui%5D%0A%5Bdopplr-browser%5D%3C-%3E%5Brpc%5D%0A)
