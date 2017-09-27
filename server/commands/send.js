const util = require('../util')

module.exports = [
  /\/send (([0-9]*[.])?[0-9]+) (@\w+)/,
  (models, bot, message, match) => {
    const userID = message.chat.id
    const amount = match[1]
    const username = match[3].substring(1)
    const address = util.getAddressFromUsername(username)

    bot.sendMessage(userID, ...template.send(userID, amount, username, address))
  }
]
