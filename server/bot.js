const Bluebird = require('bluebird')
const TelegramBot = require('node-telegram-bot-api')

const commands = require('./commands')

module.exports = (models, cb) => {
  const bot = new TelegramBot(process.env.TELEGRAM_API_KEY, {
    polling: true
  })

  bot.sendMarkdown = function (...args) {
    return bot.sendMessage(...args, {
      parse_mode: 'Markdown'
    })
  }

  bot.sendMessageTo = function (user, ...args) {
    if (typeof user !== 'object') return bot.sendMarkdown(user, ...args)
    else return bot.sendMarkdown(user.telegram.chatId, ...args)
  }

  bot.sendMessagesTo = function (user, messages) {
    return Bluebird.mapSeries(messages, (message, index) => bot.sendMessageTo(user, message))
  }

  commands(models, bot)

  cb(null, bot)
}
