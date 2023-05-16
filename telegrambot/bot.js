const TelegramBot = require('node-telegram-bot-api')
const cron = require('node-cron')
const {
  START,
  HELP,
  INFO,
  MYPROFILE,
  LANGUAGE,
  CMD_REVIEW,
} = require('./commands')
const {
  onStart,
  onHelp,
  onInfo,
  onMyProfile,
  onLanguage,
  onReview,
  main,
  onSuccessfulPayment,
  onPrecheckoutPayment,
} = require('./logic')
const language = require('./language')
const { createBotDayStatistic } = require('./request')
const { toggleReasonHandler } = require('./handlers')

const TOKEN = process.env.TOKEN_BOT

;(async () => {
  const bot = new TelegramBot(TOKEN, { polling: true })

  // DAY STATISTIC
  // ? heroku time -3h
  cron.schedule('50 59 22 * * *', async () => await createBotDayStatistic())

  // BOT CONFIG COMMANDS
  bot.setMyCommands([
    { command: MYPROFILE, description: language['ru'].myProfileField },
    { command: CMD_REVIEW, description: language['ru'].reviewField },
    { command: LANGUAGE, description: language['ru'].languageField },
  ])

  // ON MESSAGE
  bot.on('message', async msg => {
    switch (msg?.text?.trim()) {
      case START:
        return onStart(bot, msg)
      case HELP:
        return onHelp(bot, msg)
      case INFO:
        return onInfo(bot, msg)
      case MYPROFILE:
        return onMyProfile(bot, msg)
      case LANGUAGE:
        return onLanguage(bot, msg)
      case CMD_REVIEW:
        return onReview(bot, msg)
      default:
        return main(bot, msg)
    }
  })

  // ON INLINE BUTTONS
  bot.on('callback_query', async q => {
    // * Endpoint after delete profile
    if (q.data.startsWith('delete_reason_')) {
      return toggleReasonHandler({ bot, q })
    }

    return main(bot, q.message, q)
  })

  // ON SEND LOCATION
  bot.on('location', async l => {
    console.log(l.bgYellow)
  })

  // ON SEND PHOTO
  bot.on('photo', async p => {
    console.log(p.photo?.at(-1)?.file_id?.bgBlue)
  })

  // ON SEND DOCUMENT
  bot.on('document', async d => {
    console.log(d)
  })

  // ON SEND VIDEO
  bot.on('video', async v => {
    console.log(v)
  })

  // ON PAY VIP
  bot.on('pre_checkout_query', async pay => {
    await onPrecheckoutPayment(bot, pay)
  })

  bot.on('successful_payment', async pay => {
    return onSuccessfulPayment(bot, pay)
  })
})()
