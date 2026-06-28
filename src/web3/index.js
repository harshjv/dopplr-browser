/* global web3 */

import Web3 from 'web3'
import { DopplrProvider } from './dopplr-provider'
import { Messenger } from './messenger'

if (typeof web3Ready === 'function') {
  const messenger = new Messenger()
  messenger.requestWeb3(function allowed () {
    const dopplrProvider = new DopplrProvider({ messenger })
    web3Ready(new Web3(dopplrProvider))
  })
} else {
  // do not do anything
}
