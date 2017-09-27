import ProviderEngine from 'web3-provider-engine'
import DefaultFixture from 'web3-provider-engine/subproviders/default-fixture'
import NonceTrackerSubprovider from 'web3-provider-engine/subproviders/nonce-tracker'
import CacheSubprovider from 'web3-provider-engine/subproviders/cache'
import FilterSubprovider from 'web3-provider-engine/subproviders/filters'
import SanitizingSubprovider from 'web3-provider-engine/subproviders/sanitizer'

import { DopplrWalletProvider } from './dopplr-wallet-provider'
import { DopplrRpcProvider } from './dopplr-rpc-provider'

function DopplrProvider ({ messenger }) {
  if (!messenger) throw new Error('Configure DopplrProvider properly')

  const engine = new ProviderEngine()

  engine.addProvider(new DopplrWalletProvider({ messenger }))
  engine.addProvider(new DefaultFixture({
    web3_clientVersion: 'Dopplr/v0.0.1-alpha-1',
    net_listening: true,
    eth_hashrate: '0x00',
    eth_mining: false,
    eth_syncing: true
  }))
  engine.addProvider(new SanitizingSubprovider())
  engine.addProvider(new CacheSubprovider())
  engine.addProvider(new FilterSubprovider())
  engine.addProvider(new NonceTrackerSubprovider())
  engine.addProvider(new DopplrRpcProvider({ messenger }))

  engine._ready.setMaxListeners(30)

  engine.start()

  engine.isConnected = () => {
    return true
  }

  return engine
}

export {
  DopplrProvider
}
