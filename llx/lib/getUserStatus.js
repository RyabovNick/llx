const moment = require('moment')

/**
 * Generate: { status, message, payload } response
 * @param {Object} user - user data from database
 */
function getUserStatus(user) {
  const statuses = {
    error: {
      status: 'error',
      message: {
        en: 'User with the given token is not found',
        ru: 'Пользователя с заданным токеном не существует'
      },
      payload: null
    },
    waiting: {
      status: 'waiting',
      message: {
        en: 'User is not authenticated yet',
        ru: 'Пользователь ещё не аутентифицирован'
      },
      payload: null
    },
    ok: {
      status: 'ok',
      message: {
        en: 'User authenticated',
        ru: 'Пользователь уже аутентифицирован'
      }
    },
    expired: {
      status: 'expired',
      message: { en: 'Token expired', ru: 'Токен истёк' },
      payload: null
    },
    serverError: {
      status: 'serverError',
      message: { en: 'serverError', ru: 'Ошибка сервера' },
      payload: null
    }
  }

  if (!user) {
    return {
      ...statuses.error
    }
  }

  if (!user.expired_at) {
    return {
      ...statuses.serverError
    }
  }

  if (user.expired_at && moment().isAfter(moment(user.expired_at))) {
    return {
      ...statuses.expired
    }
  }

  if (!user.payload) {
    return {
      ...statuses.waiting
    }
  }

  return {
    ...statuses.ok,
    payload: user.payload
  }
}

module.exports = { getUserStatus }
