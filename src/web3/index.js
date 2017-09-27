/* global web3 */

import Raven from 'raven-js'
import Web3 from 'web3'
import { DopplrProvider } from './dopplr-provider'
import { Messenger } from './messenger'

if (typeof web3 === 'undefined') {
  Raven.config('https://45a1e59de11a426ba004fab9a40c2e49@sentry.io/166338').install()

  const messenger = new Messenger()
  const dopplrProvider = new DopplrProvider({ messenger })

  window.web3 = new Web3(dopplrProvider)
} else if (web3.currentProvider) {
  web3 = new Web3(web3.currentProvider)
}
