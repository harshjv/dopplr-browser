function SimplePostMessage (target, targetOrigin, receiveCallBack) {
  let receive

  if (!(this instanceof SimplePostMessage)) {
    return new SimplePostMessage(target, targetOrigin, receiveCallBack)
  }

  if (!target || !targetOrigin) throw new Error('Params target and targetOrigin are required!')

  this.send = function (message, transfer) {
    target.postMessage(message, targetOrigin, transfer)
  }

  this.removeListener = function () {
    if (receive) window.removeEventListener('message', receive)
  }

  if (receiveCallBack) {
    receive = function (event) {
      receiveCallBack(event.data, event.source)
    }
    window.addEventListener('message', receive)
  }
}

export default SimplePostMessage
