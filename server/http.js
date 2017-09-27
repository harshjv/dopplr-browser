const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const nunjucks = require('nunjucks')

const routes = require('./routes')

const app = express()

app.set('x-powered-by', false)
app.use('/', express.static('./dist'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}))
app.set('view cache', process.env.NODE_ENV === 'production')
app.set('view engine', 'njk')
nunjucks.configure(path.join(__dirname, 'views'), {
  autoescape: true,
  express: app
})

module.exports = (models, bot, cb) => {
  routes(models, bot, (err, r) => {
    if (err) {
      cb(err)
      return
    }

    app.use('/', r)

    app.listen(process.env.PORT, () => {
      cb(null, process.env.PORT)
    })
  })
}
