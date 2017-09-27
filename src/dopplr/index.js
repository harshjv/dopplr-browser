/* global $ */

import Raven from 'raven-js'
Raven.config('https://0bfb39da0ded4736bbc455d8f9323fdc@sentry.io/166341').install()

import store from 'store'
import { Modal } from './modal'
import { openModal } from './open-modal'
import { Dock } from './dock'
import { DopplrService } from './service'
import { DopplrEmitter } from './emitter'

let modal

const { slug, iframeRef, serviceUrl, availableNetworks, defaultNetworkIndex } = window.dopplr

if (!slug || !iframeRef || !serviceUrl || !availableNetworks || defaultNetworkIndex === null) {
  throw new Error('Setup window object properly')
}

const iframeWindowRef = iframeRef.contentWindow
const defaultNetwork = availableNetworks[store.get('defaultNetworkIndex') || defaultNetworkIndex]

const service = new DopplrService({ slug, serviceUrl, iframeWindowRef, defaultRpcUrl: defaultNetwork.url })
const { emitter } = service
const dockEmitter = new DopplrEmitter('dock')
const dock = new Dock({ emitter: dockEmitter, currentNetworkName: defaultNetwork.name, selector: '#dock-app', availableNetworks })

const openDopplrModal = (type, params) => {
  const id = '#dopplr-modal'
  const rawParams = JSON.stringify(params, null, 2)

  if (!modal) modal = new Modal({ emitter, type, selector: '#modal-app', rawParams })
  else modal.addEvents(type, rawParams)

  openModal(id, () => {
    emitter.once('browser-modal-close', (block) => {
      emitter.removeAllListeners()

      if (block) {
        service.block()
      } else {
        emitter.once('dopplr-modal-open', openDopplrModal)
      }

      $(id).modal('hide')
    })
  })
}

const openDopplrDockModal = () => {
  const id = '#dopplr-dock-modal'

  openModal(id, () => {
    dockEmitter.once('dopplr-dock-modal-close', () => {
      dockEmitter.removeAllListeners()
      dockEmitter.once('dopplr-dock-modal-open', openDopplrDockModal)

      $(id).modal('hide')
    })

    dockEmitter.on('dopplr-dock-switch-network', (index) => {
      iframeRef.src = iframeRef.src
      service.switchNetwork(availableNetworks[index].url)
      store.set('defaultNetworkIndex', index)
      service.clear()
    })
  })
}

emitter.once('dopplr-modal-open', openDopplrModal)
dockEmitter.once('dopplr-dock-modal-open', openDopplrDockModal)
