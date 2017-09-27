const MongoDB = require('./mongodb')
const Bot = require('./bot')
const Models = require('./models')
const Http = require('./http')

module.exports = (cb) => {
  MongoDB((err, connection) => {
    if (err) {
      cb(err)
      return
    }

    console.log('Connected to mongoDB')

    Models(connection, (err, models) => {
      if (err) {
        cb(err)
        return
      }

      console.log(`Created ${Object.keys(models).length} models`)

      Bot(models, (err, bot) => {
        if (err) {
          cb(err)
          return
        }

        console.log('Started bot')

        Http(models, bot, (err, port) => {
          if (err) {
            cb(err)
            return
          }

          console.log(`Started http server on port ${port}`)
        })
      })
    })
  })
}
