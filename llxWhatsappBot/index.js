require('dotenv').config({
  path: '.env.local'
})

const https = require('http')
const fse = require('fs-extra')
const { start } = require('./whatsapp_gate')
const { logger } = require('./logger')

const listener = async (request, response) => {
  const linkUrl = request.url.slice(1).split('/')

  // /whatsapp/login/:serviceName url
  if (linkUrl[0] === 'whatsapp' && linkUrl[1] === 'login') {
    const dir = linkUrl[2]

    if (dir) {
      const page = await start(dir)

      const loggedIn = await page.evaluate(() => {
        return WAPI.isLoggedIn()
      })

      if (!loggedIn) {
        await Promise.race([
          page.waitForSelector('div._2eK7W'),
          page.waitForSelector('div img[src]')
        ])

        let img = await page.evaluate(() => {
          let use = document.querySelector('div._2eK7W')
          let img = document.querySelector('div img[src]')

          //let result = use ? (use.click(), false) : img.getAttribute('src');
          let result = use ? false : img.getAttribute('src')

          return result
        })

        if (img) {
          //await page.screenshot({path: 'example.png'});

          response.end(`<html><body><img src=${img}></body></html>`)
        } else {
          //await load(page, dir);
          await start(dir)

          response.json({ [dir]: true }).end()
        }
      } else response.json({ [dir]: true }).end()
    }
    // res.end(serviceName)
  }

  response.statusCode = 404
  response.end()
}

https.createServer(listener).listen(process.env.API_PORT, async () => {
  const path = `${__dirname}/private`
  await fse.ensureDir(path)
  const content = fse.readdirSync(path)

  for (const dir of content) {
    await start(dir)
  }

  logger.debug(`Server started on ${process.env.API_PORT}`)
})
