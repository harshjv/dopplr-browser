if (process.env.NODE_ENV === 'production') {
  require('raven').config(process.env.SENTRY_DSN).install()
}

require('./server')((err) => {
  throw err
})
