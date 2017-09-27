const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

module.exports = function (cb) {
  const conn = mongoose.createConnection(process.env.MONGODB_URI)

  conn.once('error', () => {
    throw new Error('Error connecting mongoDB')
  })

  conn.once('open', () => cb(null, conn))
}
