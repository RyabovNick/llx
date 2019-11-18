require('dotenv').config({
  path: '.env.local'
})
const { Bot, Events, Message } = require('viber-bot')
const axios = require('axios')
const http = require('http')
const fs = require('fs')
const { logAction, logger } = require('./logger')
const { messages } = require('../public/messages')

const bot = new Bot({
  authToken: process.env.VIBER_TOKEN,
  name: process.env.VIBER_NAME,
  avatar: process.env.VIBER_AVATAR
})

const accessToken = process.env.ACCESS_TOKEN
const url = `${process.env.API_PROTOCOL}://${process.env.API_HOST}${process.env.API_SUFFIX}`

axios.defaults.baseURL = url
axios.defaults.headers.common['access_token'] = accessToken

bot.on(
  Events.CONVERSATION_STARTED,
  async ({ userProfile }, isSubscribed, context, onFinish) => {
    const token = context

    const language = userProfile.language === 'ru' ? 'ru' : 'en'

    if (!token) {
      logAction('get start without token', userProfile)
      bot.sendMessage(
        userProfile,
        new Message.Text(messages.tokenNotFound[language])
      )
      return
    }

    const payload = {
      ...userProfile
    }

    logAction('auth try', userProfile)

    try {
      const { data } = await axios.post('login', {
        token,
        payload
      })

      if (data) {
        logAction('success auth', { ...userProfile, response: data })
        bot.sendMessage(
          userProfile,
          new Message.Text(messages.success[language])
        )
      }

      return
    } catch (err) {
      if (!err.response) {
        logAction('error', err)
        bot.sendMessage(
          userProfile,
          new Message.Text(messages.undefinedError[language])
        )
        return
      }

      const { response } = err

      if (
        response.status >= 400 &&
        response.status < 500 &&
        response.status !== 404
      ) {
        logAction('failed auth try', {
          ...userProfile,
          response: response.data
        })
        bot.sendMessage(
          userProfile,
          new Message.Text(
            `${messages.error[language]}: ${response.data.message[language]}`
          )
        )
        return
      }

      logAction(
        `Error with ${userProfile.id} auth.
        status: ${response.status}
        data: ${response.data}
        statusText: ${response.statusText}
        `,
        userProfile
      )
      bot.sendMessage(
        userProfile,
        new Message.Text(messages.undefinedError[language])
      )
      return
    }
  }
)

const port = process.env.VIBER_HTTP_PORT
const webhookUrl = process.env.VIBER_WEBHOOK

http.createServer(bot.middleware()).listen(port, err => {
  if (err) {
    console.log('err: ', err)
    logger.error('listen error', { context: err })
  }
  bot.setWebhook(webhookUrl).catch(err => {
    console.log('err: ', err)
    logger.error('setWebhook error', { context: err })
  })
})
