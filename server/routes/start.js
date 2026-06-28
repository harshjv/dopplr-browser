const uuid = require('uuid')
const speakeasy = require('speakeasy')
const sha512 = require('sha512')

module.exports = (router, models, bot) => {
  router.get('/start/:slug', (req, res) => {
    const { slug } = req.params

    res.set({
      'X-Frame-Options': 'deny'
    })

    models.User.findBySlug(slug, (err, user) => {
      if (err) {
        return res.json({
          success: false,
          error: `Something went wrong :/`
        })
      }

      if (!user) {
        return res.json({
          success: false,
          error: `No user found with slug ${slug}`
        })
      }

      if (user.ethereum.address) {
        return res.json({
          success: false,
          error: 'User has already created a wallet'
        })
      }

      res.render('start', {
        slug: req.params.slug
      })
    })
  })

  router.post('/start/:slug', (req, res) => {
    const { slug } = req.params
    const { encryptedPrivateKey, encryptedSeed, address } = req.body

    res.set({
      'X-Frame-Options': 'deny'
    })

    models.User.findBySlug(slug, (err, user) => {
      if (err) {
        return res.json({
          success: false,
          error: `Something went wrong :/`
        })
      }

      if (!user) {
        return res.json({
          success: false,
          error: `No user found with slug ${slug}`
        })
      }

      if (user.ethereum.address) {
        return res.json({
          success: false,
          error: 'User has already created a wallet'
        })
      }

      const secret = speakeasy.generateSecret({ length: 20 })
      user.slug = sha512(uuid.v4()).toString('hex')
      user.hotp.secret = secret.base32
      user.ethereum.address = address
      user.ethereum.encryptedSeed = encryptedSeed
      user.ethereum.encryptedPrivateKey = encryptedPrivateKey

      user.markModified('ethereum.address')
      user.markModified('ethereum.encryptedSeed')
      user.markModified('ethereum.encryptedPrivateKey')

      user.save((err) => {
        if (err) {
          console.error(err)

          return res.json({
            success: false,
            error: `Something went wrong while saving the encrypted data :/`
          })
        }

        bot.sendMessagesTo(user, [
          'You have successfully generated your Ethereum wallet 🎉',
          `📢 Public address: \`${user.ethereum.address}\``,
          `🔐 Encrypted seed phrase: \`${user.ethereum.encryptedSeed}\``,
          `🔐 Encrypted private key: \`${user.ethereum.encryptedPrivateKey}\``,
          `🎁 Your web3-enabled URL: https://dopplr.io/${user.telegram.username}/web3`,
          `🌏 You can append URL of dopplr-compatible dApps to your web3-enabled URL to start browsing dApps on any platform and any browser`,
          `🗃 For example, To access Ethereum Wallet: https://dopplr.io/${user.telegram.username}/web3/https://dopplr.github.io/ethereum-wallet/`
        ]).then(() => res.json({
          success: true
        }))
      })
    })
  })

  return router
}
