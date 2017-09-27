const speakeasy = require('speakeasy')

const template = require('../template')

const handleMethod = (user, bot, req, res, method, slug, data) => {
  return {
    otp_request () {
      let otp

      if (req.header('host').startsWith('dev')) {
        otp = '123456'
      } else {
        const { counter, secret } = user.hotp

        otp = speakeasy.hotp({
          secret,
          counter,
          encoding: 'base32'
        })
      }

      if (data.type === 'accounts') {
        bot
        .sendMessageTo(user, `🔑 Use this OTP to share your public addresses: ${otp}`)
        .then(() => {
          res.json({
            success: true
          })
        })
      } else {
        bot
        .sendMessagesTo(user, [
          `🔏 You have initiated a ${data.type} signing process, and here is the ${data.type} to be signed;`,
          template[data.type](data.params),
          `🔑 OTP to sign this ${data.type} is ${otp}`
        ])
        .then(() => {
          res.json({
            success: true
          })
        })
      }
    },
    otp_verify () {
      let verified
      const { counter, secret } = user.hotp

      if (req.header('host').startsWith('dev')) {
        verified = data.otp === '123456'
      } else {
        verified = speakeasy.hotp.verify({
          secret,
          counter,
          encoding: 'base32',
          token: data.otp
        })
      }

      if (verified) {
        if (req.header('host').startsWith('dev')) {
          res.json({
            success: true,
            data: {
              _encryptedPrivateKey: data.encryptedPrivateKey ? user.ethereum.encryptedPrivateKey : null,
              _accounts: data.accounts ? [ user.ethereum.address ] : null
            }
          })
        } else {
          user.hotp.counter = counter + 1
          user.markModified('hotp.counter')

          user.save((err) => {
            if (err) {
              console.error(err)

              res.json({
                success: false,
                error: `Something went wrong while validating OTP :/`
              })
            } else {
              res.json({
                success: true,
                data: {
                  _encryptedPrivateKey: data.encryptedPrivateKey ? user.ethereum.encryptedPrivateKey : null,
                  _accounts: data.accounts ? [ user.ethereum.address ] : null
                }
              })
            }
          })
        }
      } else {
        res.json({
          success: false,
          error: 'Invalid OTP'
        })
      }
    },
    addresses_request () {
      res.json({
        success: true,
        data: {
          addresses: data.addresses ? [ user.ethereum.address ] : null
        }
      })
    }
  }
}

module.exports = (router, models, bot) => {
  router.post('/service', (req, res) => {
    const { method, slug, data } = req.body

    if (!method) {
      return res.json({
        success: false,
        error: 'Supply method'
      })
    }

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

      if (!user.ethereum.address) {
        return res.json({
          success: false,
          error: 'No wallet found'
        })
      }

      return (handleMethod(user, bot, req, res, method, slug, data)[method] || function () {
        return res.json({
          success: false,
          error: 'Invalid method ' + method
        })
      })()
    })
  })

  return router
}
