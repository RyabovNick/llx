const moment = require('moment')

/**
 * Generate: { status, message, payload } response
 * @param {Object} user - user data from database
 */
function getJwtPayload(user) {
  const statuses = {
    error: {
      status: 'error',
      message: 'User with the given token is not found',
      payload: null
    },
    waiting: {
      status: 'waiting',
      message: 'User is not authenticated yet',
      payload: null
    },
    ok: {
      status: 'ok',
      message: 'User authenticated'
    },
    expired: {
      status: 'expired',
      message: 'Token expired',
      payload: null
    },
    serverError: {
      status: 'serverError',
      message: 'serverError',
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

module.exports = { getJwtPayload }
