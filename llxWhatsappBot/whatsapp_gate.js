const puppeteer = require('puppeteer')
const injectWAPI = require('./wapi')
const fse = require('fs-extra')
const { logAction } = require('./logger')

// const axios = require('axios')

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
        console.error(err)
        return waitMessages(page)
      }
    })
  })
}

const cycle = async (page, dir) => {
  const loggedIn = await page.evaluate(() => {
    return WAPI.isLoggedIn()
  })

  if (loggedIn) {
    let promise = waitMessages(page)

    const repeat = async messages => {
      try {
        console.log(messages.map(msg => msg.body))

        for (let message of messages) {
          console.log('message: ', message)
          // if (!message.body) continue

          // let { data } = await axios.post(process.env.WA_DF_BACK, {
          //   project: dir,
          //   message
          // })

          // for (let msg of data) {
          //   message = { ...message, ...msg }

          //   await page.evaluate(message => {
          //     WAPI.sendSeen(message.from._serialized)
          //     return WAPI.sendMessage(message.from._serialized, message.body)
          //   }, message)

          //   let timeout = process.env.WA_MESSAGE_SEND_TIMEOUT || 500
          //   await new Promise(resolve => setTimeout(resolve, timeout))
          // }
        }
      } catch (err) {
        console.error(err)
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
launchPuppeteer = async path =>
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
  await page.screenshot({ path: 'page.png' })

  await cycle(page, dir)

  console.log(`started: ${dir}`)

  return page
}

module.exports = { start }
