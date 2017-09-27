import uuid from 'uuid'
import Debug from 'debug'
import SimplePostMessage from '../post-message'

const debug = Debug('dopplr:messenger')

class Messenger {
  constructor () {
    this.toParent = new SimplePostMessage(window.parent.window, '*', (...args) => this.onResponse(...args))
    this.callbacks = {}
    this.blocked = false
  }

  onResponse (d, srcWin) {
    if (!d) return

    const { dopplrRequestId, error, data } = d

    if (dopplrRequestId === 'blocked') {
      this.blocked = true

      return
    }

    if (dopplrRequestId === 'clear') {
      delete this.callbacks
      this.callbacks = {}

      return
    }

    if (!dopplrRequestId) {
      debug('Ignoring foriegn data', d)
      return
    }

    debug(`response:${dopplrRequestId}`, error, data)

    this.executeResponse(dopplrRequestId, error, data)
  }

  executeResponse (dopplrRequestId, err, data) {
    const cb = this.callbacks[dopplrRequestId]
    if (cb) cb(err, data)
    else debug('miss', dopplrRequestId, err, data)
  }

  sendRequest (method, data, cb) {
    if (method !== 'rpc' && this.blocked) {
      cb('Access denied')
      return
    }

    const dopplrRequestId = uuid.v4()

    if (this.callbacks[dopplrRequestId]) {
      throw new Error('id collision')
    }

    this.callbacks[dopplrRequestId] = cb

    debug(`request:${dopplrRequestId}`, method, data)

    this.toParent.send({ dopplrRequestId, method, data })
  }
}

export {
  Messenger
}
