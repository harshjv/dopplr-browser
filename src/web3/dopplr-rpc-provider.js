import { inherits } from 'util'
import Debug from 'debug'
import SubProvider from 'web3-provider-engine/subproviders/subprovider'

const debug = Debug('dopplr:rpc-provider')

inherits(DopplrRpcProvider, SubProvider)

function DopplrRpcProvider ({ messenger }) {
  if (!messenger) throw new Error('Configure DopplrRpcProvider properly')

  this.messenger = messenger
}

const handle = (payload, cb) => (...args) => {
  debug('**********')
  debug(payload)

  if (payload.method === 'eth_getLogs') {
    debug('eth_getLogs', payload, args)
  }

  debug(...args)
  debug('**********')

  try {
    cb(...args)
  } catch (e) {
    console.log(e)
  }
}

DopplrRpcProvider.prototype.handleRequest = function (payload, next, end) {
  payload.params = payload.params.map((param) => {
    if (typeof param === 'string' &&
        param.length !== 42 &&
        param !== '0x0' &&
        param.startsWith('0x') &&
        param.charAt(2) === '0') {
      debug(`Changed ${param} to 0x${param.substring(3)}`)

      return `0x${param.substring(3)}`
    } else if (typeof param === 'object') {
      const keys = Object.keys(param)

      keys.map((key) => {
        const val = param[key]

        debug(`Val is ${val} and typeof val is ${typeof val}`)

        if (typeof val === 'string' &&
          val.length !== 42 &&
          val !== '0x0' &&
          val.startsWith('0x') &&
          val.charAt(2) === '0') {
          param[key] = `0x${val.substring(3)}`
          debug(`Changed ${val} to ${param[key]}`)
        } else {
          debug(`Unchanged ${val} to ${param[key]}`)
        }
      })

      return param
    } else {
      return param
    }
  })

  this.messenger.sendRequest('rpc', payload, handle(payload, end))
}

export {
  DopplrRpcProvider
}
