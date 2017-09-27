const multihashes = require('multihashes')

module.exports = (router, models, bot) => {
  router.get('/:username', (req, res) => {
    const { username } = req.params

    res.set({
      'X-Frame-Options': 'deny'
    })

    models.User.findByUsername(username, (err, user) => {
      if (err) {
        return res.sendStatus(500)
      }

      if (!user) {
        return res.sendStatus(404)
      }

      res.redirect('/' + username + '/web3/' + process.env.DAPP_URL)
    })
  })

  router.get('/:username/web3', (req, res) => {
    const { username } = req.params

    res.set({
      'X-Frame-Options': 'deny'
    })

    models.User.findByUsername(username, (err, user) => {
      if (err) {
        return res.sendStatus(500)
      }

      if (!user) {
        return res.sendStatus(404)
      }

      res.redirect('/' + username + '/web3/' + process.env.DAPP_URL)
    })
  })

  router.get('/:username/web3/*', (req, res) => {
    const { username } = req.params

    res.set({
      'X-Frame-Options': 'deny'
    })

    models.User.findByUsername(username, (err, user) => {
      if (err) {
        return res.sendStatus(500)
      }

      if (!user) {
        return res.sendStatus(404)
      }

      const raw = req.originalUrl.split('/')

      raw.shift()
      raw.shift()
      raw.shift()

      let dAppUrl = raw.join('/')

      if (!dAppUrl.startsWith('http')) {
        try {
          multihashes.validate(multihashes.fromB58String(dAppUrl))
          dAppUrl = `https://ipfs.io/ipfs/${dAppUrl}`
        } catch (e) {
          res.redirect('/' + username + '/web3/' + process.env.DAPP_URL)
          return
        }
      }

      res.render('web3', {
        url: dAppUrl,
        slug: user.slug
      })
    })
  })

  return router
}
