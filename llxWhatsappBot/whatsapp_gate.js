const puppeteer = require('puppeteer')
const injectWAPI = require('./wapi')
const fse = require('fs-extra')
const { logAction, logger } = require('./logger')
const { messages: responseMessages } = require('../public/messages')
const axios = require('axios')

const accessToken = process.env.ACCESS_TOKEN
const url = `${process.env.API_PROTOCOL}://${process.env.API_HOST}${process.env.API_SUFFIX}`

axios.defaults.baseURL = url
axios.defaults.headers.common['access_token'] = accessToken

const waitMessages = page => {
  return page.evaluate(() => {
    return new Promise((resolve, reject) => {
      try {
        let unread = WAPI.getUnreadMessages()

        if (unread.length && unread.messages && unread.messages.length) {
          resolve(unread.messages)
        } else {
          WAPI.waitNewMessages(true, messages => {
            resolve(messages)
          })
        }
      } catch (err) {
        logger.error('waitMessages error', err)
        return waitMessages(page)
      }
    })
  })
}

/**
 * Return token from message.
 * It look for the token and return the next word after it.
 *
 * Return false if token not found
 * Return false if there is no word behind the token
 * @param {String} message
 */
const getTokenFromMsg = message => {
  const searchWord = 'token'
  const messageArray = message.split(' ')
  const searchWordIndex = messageArray.findIndex(word => word === searchWord)

  if (searchWordIndex === -1) return false
  if (searchWordIndex + 1 >= messageArray.length) return false

  return messageArray[searchWordIndex + 1]
}

const cycle = async (page, dir) => {
  const loggedIn = await page.evaluate(() => {
    return WAPI.isLoggedIn()
  })

  if (loggedIn) {
    let promise = waitMessages(page)

    const repeat = async messages => {
      for (let message of messages) {
        if (!message.body) continue
        const language = 'ru'
        const token = getTokenFromMsg(message.body)

        if (!token) {
          logAction('get start without token', message.sender)
          await page.evaluate(
            ({ message, responseMessages, language }) => {
              WAPI.sendSeen(message.from._serialized)
              return WAPI.sendMessage(
                message.from._serialized,
                responseMessages.tokenNotFound[language]
              )
            },
            { message, responseMessages, language }
          )

          let timeout = process.env.WA_MESSAGE_SEND_TIMEOUT || 500
          await new Promise(resolve => setTimeout(resolve, timeout))
        } else {
          const payload = {
            ...message.sender
          }

          logAction('auth try', payload)

          try {
            const { data } = await axios.post('login', {
              token,
              payload
            })

            if (data) {
              logAction('success auth', { ...payload, response: data })
              await page.evaluate(
                ({ message, responseMessages, language }) => {
                  WAPI.sendSeen(message.from._serialized)
                  return WAPI.sendMessage(
                    message.from._serialized,
                    responseMessages.success[language]
                  )
                },
                { message, responseMessages, language }
              )

              let timeout = process.env.WA_MESSAGE_SEND_TIMEOUT || 500
              await new Promise(resolve => setTimeout(resolve, timeout))
            }
          } catch (err) {
            if (!err.response) {
              logAction('error', err)
              await page.evaluate(
                ({ message, responseMessages, language }) => {
                  WAPI.sendSeen(message.from._serialized)
                  return WAPI.sendMessage(
                    message.from._serialized,
                    responseMessages.undefinedError[language]
                  )
                },
                { message, responseMessages, language }
              )

              let timeout = process.env.WA_MESSAGE_SEND_TIMEOUT || 500
              await new Promise(resolve => setTimeout(resolve, timeout))
            } else if (
              err.response.status >= 400 &&
              err.response.status < 500 &&
              err.response.status !== 404
            ) {
              const { response } = err
              logAction('failed auth try', {
                ...payload,
                response: response.data
              })
              await page.evaluate(
                ({ message, responseMessages, language, responseError }) => {
                  WAPI.sendSeen(message.from._serialized)
                  return WAPI.sendMessage(
                    message.from._serialized,
                    `${responseMessages.error[language]}: ${responseError}`
                  )
                },
                {
                  message,
                  responseMessages,
                  language,
                  responseError: response.data.message[language]
                }
              )

              let timeout = process.env.WA_MESSAGE_SEND_TIMEOUT || 500
              await new Promise(resolve => setTimeout(resolve, timeout))
            } else {
              logAction(
                `Error with ${message.from._serialized} auth.
                  status: ${response.status}
                  data: ${response.data}
                  statusText: ${response.statusText}
                  `,
                userProfile
              )
              await page.evaluate(
                ({ message, responseMessages, language }) => {
                  WAPI.sendSeen(message.from._serialized)
                  return WAPI.sendMessage(
                    message.from._serialized,
                    responseMessages.undefinedError[language]
                  )
                },
                { message, responseMessages, language }
              )

              let timeout = process.env.WA_MESSAGE_SEND_TIMEOUT || 500
              await new Promise(resolve => setTimeout(resolve, timeout))
            }
          }
        }
      }

      promise = waitMessages(page)

      promise.then(repeat).catch(err => console.error(err))
    }

    promise.then(repeat).catch(err => console.error(err))

    return true
  }

  return false
}

const browsers = {}

/**
 * Launch puppeteer depending on NODE_ENV
 */
const launchPuppeteer = async path =>
  process.env.NODE_ENV === 'dev'
    ? puppeteer.launch({
        args: ['--no-sandbox'],
        headless: true,
        userDataDir: path
      })
    : puppeteer.launch({
        args: ['--no-sandbox'],
        executablePath: '/usr/bin/chromium-browser',
        headless: true,
        userDataDir: path
      })

const start = async dir => {
  try {
    browsers[dir] && (await browsers[dir].close())
  } catch (err) {}

  const path = `${__dirname}/private/${dir}`
  await fse.ensureDir(path)
  await fse.remove(`${path}/Default/Service Worker/Database`)

  const browser = await launchPuppeteer(path)
  browsers[dir] = browser

  const page = await browser.newPage()

  await page.setUserAgent(process.env.WA_USER_AGENT)
  await page.goto(process.env.WA_WHATSAPP_WEB, { waitUntil: 'networkidle2' })

  await page.screenshot({ path: 'page.png' })

  //page = await load(page, dir);

  try {
    await Promise.race([
      page.waitForSelector('div._2eK7W'),
      page.waitForSelector('div img[alt]'),
      page.waitForSelector('span[data-icon]')
    ])
  } catch (err) {
    await page.screenshot({ path: 'err.png' })
  }

  await page.evaluate(injectWAPI).catch(err => console.log(err))

  await cycle(page, dir)

  console.log(`started: ${dir}`)

  return page
}

module.exports = { start }
