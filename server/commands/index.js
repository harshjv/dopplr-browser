const commands = [
  require('./start'),
  require('./send')
]

module.exports = (models, bot) => {
  commands.map((command) => {
    bot.onText(command[0], (...args) => command[1](models, bot, ...args))
  })
}
