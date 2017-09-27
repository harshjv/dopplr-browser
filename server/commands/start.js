const uuid = require('uuid')

const telegramObjectFromMessage = (message) => {
  return {
    userId: message.from.id,
    username: message.from.username,
    chatId: message.chat.id,
    firstName: message.from.first_name,
    lastName: message.from.last_name
  }
}

module.exports = [
  /^\/start$/,
  (models, bot, message, match) => {
    models.User.create({
      slug: uuid.v4(),
      telegram: telegramObjectFromMessage(message)
    }, (err, user) => {
      if (err) {
        console.error(err)

        if (err.message.indexOf('duplicate') !== -1) {
          bot.sendMessageTo(message.chat.id, 'You are already in!')
        } else {
          bot.sendMessageTo(message.chat.id, 'Something went wrong')
        }

        return
      }

      bot.sendMessagesTo(user, [
        `Hello ${user.telegramFullName}`,
        'Visit this link to *securely* create your Ethereum wallet.',
        `${process.env.APP_URL}/start/${user.slug}`
      ])
    })

    // userIDToUserName[message.from.id] = message.from.username
    // usernameToUserID[message.from.username] = message.from.id
    // userIDToUserData[message.from.id] = {
    //   first_name: message.from.first_name,
    //   last_name: message.from.last_name,
    //   username: message.from.username,
    //   full_name: `${message.from.first_name} ${message.from.last_name}`
    // }

    // bot.sendMessage(chatId, uuid.v4())
  }
]
