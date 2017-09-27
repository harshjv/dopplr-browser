import { inherits } from 'util'
import Debug from 'debug'
import HookedWalletProvider from 'web3-provider-engine/subproviders/hooked-wallet'

inherits(DopplrWalletProvider, HookedWalletProvider)

const debug = Debug('dopplr:wallet-provider')

function DopplrWalletProvider ({ messenger }) {
  if (!messenger) throw new Error('Configure DopplrWalletProvider properly')

  let accountsCache
  let requestingAccounts = false
  let accountsCallbacklog = []

  const self = this
  const opts = {}

  opts.getAccounts = function (cb) {
    debug('getAccounts')

    if (accountsCache) {
      cb(null, accountsCache)
    } else if (requestingAccounts) {
      accountsCallbacklog.push(cb)
    } else {
      requestingAccounts = true
      messenger.sendRequest('getAddresses', null, (err, accounts) => {
        requestingAccounts = false

        if (err) {
          cb(err)
          return
        }

        while (accountsCallbacklog.length > 0) {
          const cb = accountsCallbacklog.pop()

          cb(err, accounts)
        }

        accountsCache = accounts

        window.web3.eth.defaultAccount = accounts[0]

        cb(null, accounts)
      })
    }
  }

  opts.approveTransaction = function (txParams, cb) {
    debug('approveTransaction')

    messenger.sendRequest('approveTransaction', txParams, cb)
  }

  opts.approveMessage = function (msgParams, cb) {
    debug('approveMessage')

    messenger.sendRequest('approveMessage', msgParams, cb)
  }

  self.signTransaction = function (txData, cb) {
    debug('signTransaction')

    messenger.sendRequest('signTransaction', txData, cb)
  }

  self.signMessage = function (msgParams, cb) {
    debug('signMessage')

    messenger.sendRequest('signMessage', msgParams, cb)
  }

  self.signPersonalMessage = function (msgParams, cb) {
    debug('signPersonalMessage')

    messenger.sendRequest('signPersonalMessage', msgParams, cb)
  }

  DopplrWalletProvider.super_.call(self, opts)
}

export {
  DopplrWalletProvider
}
