require('dotenv').config({
  path: '.env.local',
})

const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')
const token = process.env.TELEGRAM_TOKEN
const accessToken = process.env.ACCESS_TOKEN
const url = `${process.env.API_PROTOCOL}://${process.env.API_HOST}${process.env.API_SUFFIX}`
const { logAction } = require('./logger')
const { messages } = require('../public/messages')

axios.defaults.baseURL = url
axios.defaults.headers.common['access_token'] = accessToken

const bot = new TelegramBot(token, { polling: true })

const adminTgId = process.env.ADMIN_TG_ID

bot.onText(/\/start/, async msg => {
  const token = msg.text.split(' ')[1]

  const language = msg.from.language_code === 'ru' ? 'ru' : 'en'

  if (!token) {
    logAction('get start without token', msg)
    bot.sendMessage(msg.from.id, messages.tokenNotFound[language])
    return
  }

  const payload = {
    ...msg.from,
    date: msg.date,
  }

  logAction('auth try', msg)

  try {
    const { data } = await axios.post('login', {
      token,
      payload,
    })

    if (data) {
      logAction('success auth', { ...msg, response: data })
      bot.sendMessage(msg.from.id, messages.success[language])
    }

    return
  } catch (err) {
    if (!err.response) {
      bot.sendMessage(
        adminTgId,
        `Error with ${msg.from.id} auth.
        code: ${err.code}
        message: ${err.message}
        `
      )
      bot.sendMessage(msg.from.id, messages.undefinedError[language])
      return
    }

    const { response } = err

    if (
      response.status >= 400 &&
      response.status < 500 &&
      response.status !== 404
    ) {
      logAction('failed auth try', { ...msg, response: response.data })
      bot.sendMessage(
        msg.from.id,
        `${messages.error[language]}: ${response.data.message[language]}`
      )
      return
    }

    bot.sendMessage(
      adminTgId,
      `Error with ${msg.from.id} auth.
      status: ${response.status}
      data: ${response.data}
      statusText: ${response.statusText}
      `
    )
    bot.sendMessage(msg.from.id, messages.undefinedError[language])
    return
  }
})
