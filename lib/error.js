class ErrorWithStatus extends Error {
  message_i18n
  constructor(message, statusCode) {
    super(message.en)

    this.statusCode = statusCode
    this.message_i18n = message
  }
}

module.exports = { ErrorWithStatus }
