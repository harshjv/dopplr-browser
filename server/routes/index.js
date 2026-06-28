const path = require('path')
const glob = require('glob')
const router = require('express').Router()

module.exports = (models, bot, cb) => {
  glob(path.join(__dirname, '*.js'), (err, files) => {
    if (err) {
      cb(err)
      return
    }

    const routes = files
    .map((file) => path.basename(file, '.js'))
    .filter((file) => file !== 'index')
    .map((file) => require('./' + file)(router, models, bot))

    cb(null, routes)
  })
}
