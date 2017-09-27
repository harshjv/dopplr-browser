/* global Vue */

const steps = [
  'verify, fetch & decrypt',
  'approve',
  'fetch'
]

class Modal {
  constructor ({ emitter, type, selector, rawParams }) {
    this.emitter = emitter
    this.selector = selector
    this.init(type, rawParams)
  }

  init (type, rawParams) {
    const ref = this

    this.dopplrModal = new Vue({
      el: ref.selector,
      data: Object.assign({ type, rawParams }, Modal.getDefaultData(type)),
      methods: {
        verify: function () {
          this.loading = true

          if (this.type === 'accounts') {
            ref.emitter.emit('addresses-otp-enter', this.otp)
          } else {
            ref.emitter.emit('secrets-enter', this.otp, this.password)
          }
        },
        approve: function () {
          ref.emitter.emit('approved', true)
          ref.close()
        },
        reject: function () {
          ref.emitter.emit('approved', false)
          ref.close()
        },
        close: function () {
          if (this.currentStep === 0 || this.currentStep === 3) {
            ref.emitter.emit('approved', false)
          }

          ref.close()
        },
        block: function () {
          ref.emitter.emit('approved', false)
          ref.close(true)
        }
      }
    })

    this.addEvents(type, rawParams)
  }

  addEvents (type, rawParams) {
    const ref = this

    this.dopplrModal.type = type
    this.dopplrModal.rawParams = rawParams

    ref.emitter.once('otp-sent', () => {
      this.dopplrModal.otpSent = true
      this.dopplrModal.loading = false
    })

    if (type === 'accounts') {
      ref.emitter.once('addresses-otp-invalid', () => {
        this.dopplrModal.invalidSecrets = 'otp' // system/otp/password
        this.dopplrModal.loading = false
      })

      ref.emitter.once('addresses-ready', () => {
        this.dopplrModal.currentStep = 3
        this.dopplrModal.currentStepP = 1
        this.dopplrModal.currentStepTitle = steps[1]
        this.dopplrModal.loading = false
      })
    } else {
      ref.emitter.once('secrets-invalid', (type) => {
        this.dopplrModal.invalidSecrets = type // system/otp/password
        this.dopplrModal.loading = false
      })

      ref.emitter.once('private-key-ready', () => {
        this.dopplrModal.currentStep = 1
        this.dopplrModal.currentStepTitle = steps[1]
        this.dopplrModal.loading = false
      })
    }
  }

  close (block = false) {
    Object.assign(this.dopplrModal, Modal.getDefaultData())
    this.emitter.emit('browser-modal-close', block)
  }
}

Modal.getDefaultData = (type) => {
  return {
    currentStep: 0,
    totalSteps: steps.length,
    currentStepTitle: type === 'accounts' ? steps[2] : steps[0],
    currentStepP: 0,
    otp: null,
    password: null,
    loading: true,
    otpSent: false,
    invalidSecrets: null,
    type: null,
    rawParams: null
  }
}

export {
  Modal
}
