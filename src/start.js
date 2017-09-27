/* global Vue, $ */

import hdkey from 'ethereumjs-wallet/hdkey'
import CryptoJS from 'crypto-js'

import { generateRandomSeed } from './util'

function capitalizeFirstLetter (string) {
  return `encrypted${string.charAt(0).toUpperCase()}${string.slice(1)}`
}

const batchEncrypt = (password, object) => {
  const keys = Object.keys(object)
  const ret = {}

  keys
  .map((key) => {
    ret[capitalizeFirstLetter(key)] = CryptoJS.AES.encrypt(object[key], password).toString()
  })

  return ret
}

const getKeys = (seed, password, cb) => {
  const hdWallet = hdkey.fromMasterSeed(seed)
  const wallet = hdWallet.getWallet()

  const encryptedData = batchEncrypt(password, {
    seed: seed,
    privateKey: wallet.getPrivateKeyString()
  })

  const address = wallet.getAddressString()

  cb(Object.assign({ address }, encryptedData))
}

let start = new Vue({
  data: {
    phase: 0,
    seed: null,
    verifySeed: '',
    success: null,
    password: null,
    progress: 25,
    progressStyleObject: {
      width: '25%'
    },
    loading: false,
    etherscanUrl: null,
    address: null
  },
  methods: {
    confirmPassword: function () {
      this.progress += 25
      this.progressStyleObject.width = '50%'
      this.phase = 1
      this.seed = generateRandomSeed()
    },
    readyToConfirm: function () {
      this.progress += 25
      this.progressStyleObject.width = '75%'
      this.phase = 2
    },
    confirm: function () {
      this.loading = true

      if (this.verifySeed === this.seed) {
        getKeys(this.seed, this.password, ({ address, encryptedPrivateKey, encryptedSeed }) => {
          this.loading = false
          this.progress += 25
          this.progressStyleObject.width = '100%'
          this.success = true
          this.address = address

          $.post('/start/' + window.dopplr.slug, { address, encryptedSeed, encryptedPrivateKey })

          $.ajax({
            url: 'https://faucet.metamask.io/',
            type: 'POST',
            data: address,
            beforeSend: (xhr) => xhr.setRequestHeader('Content-Type', 'application/rawdata')
          })
          .done((tx) => {
            this.etherscanUrl = `https://ropsten.etherscan.io/tx/${tx}`
          })
        })
      } else {
        this.loading = false
        this.success = false
      }
    }
  }
})

start.$mount('#app')
