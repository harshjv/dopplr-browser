module.exports = (router, models, bot) => {
  router.get('/', (req, res) => {
    res.set({
      'X-Frame-Options': 'deny'
    })

    res.render('home')
  })

  return router
}
