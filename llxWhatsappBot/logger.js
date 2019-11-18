const { createLogger, format, transports } = require('winston')
const { combine, timestamp, json, prettyPrint } = format

const logger = createLogger({
  format: combine(json(), timestamp(), prettyPrint()),
  transports: [
    new transports.Console({
      handleExceptions: true
    })
  ],
  exitOnError: false
})

/**
 *
 * @param {JSON} from - information about the user who send the msg
 * @param {STRING} msg - msg
 */
const logAction = (msg, from) => {
  logger.info(msg, { context: { ...from } })
}

module.exports = {
  logger,
  logAction
}
