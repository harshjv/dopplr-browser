/* global Vue */

class Dock {
  constructor ({ emitter, currentNetworkName, selector, availableNetworks }) {
    this.emitter = emitter
    this.selector = selector
    this.availableNetworks = availableNetworks
    this.init(currentNetworkName, availableNetworks)
  }

  init (currentNetworkName, availableNetworks) {
    const ref = this

    this.dock = new Vue({
      el: ref.selector,
      data: { currentNetworkName, availableNetworks },
      methods: {
        switchNetwork: function () {
          ref.emitter.emit('dopplr-dock-modal-open')
        },
        selectNetwork: function (selectedNetworkIndex) {
          ref.dock.currentNetworkName = ref.availableNetworks[selectedNetworkIndex].name
          ref.emitter.emit('dopplr-dock-switch-network', selectedNetworkIndex)
        },
        close: function () {
          ref.emitter.emit('dopplr-dock-modal-close')
        }
      }
    })
  }

  close () {
    this.emitter.emit('browser-dock-modal-close')
  }
}

export {
  Dock
}
