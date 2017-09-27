const Web3 = require('web3')
const web3 = new Web3()

module.exports = {
  message (params) {
    return `*From:* ${params.from}\n*Data:* ${params.data}`
  },
  transaction (params) {
    return `*From:* ${params.from}\n*To:* ${params.to}\n*Value:* ${web3.fromWei(params.value)} ETH\n*Gas:* ${web3.toDecimal(params.gas)} ETH`
  }
}
