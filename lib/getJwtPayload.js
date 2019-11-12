const moment = require('moment')

/**
 * Generate: { status, message, payload } response
 * @param {Object} user - user data from database
 */
function getJwtPayload(user) {
  const statuses = {
    error: {
      status: 'error',
      message: 'User with the given token is not found'
    },
    waiting: {
      status: 'waiting',
      message: 'User is not authenticated yet'
    },
    ok: {
      status: 'ok',
      message: 'User authenticated'
    },
    expired: {
      status: 'expired',
      message: 'Token expired'
    }
  }

  if (!user)
    return {
      ...statuses.error,
      payload: null
    }
  if (user.expired_at && moment().isAfter(moment(user.expired_at)))
    return {
      ...statuses.expired,
      payload: null
    }
  if (!user.payload)
    return {
      ...statuses.waiting,
      payload: null
    }

  return {
    ...statuses.ok,
    payload: user.payload
  }
}

module.exports = { getJwtPayload }
