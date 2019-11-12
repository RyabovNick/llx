/**
 * Return error status code
 *
 * if error.statusCode is set, then return it
 *
 * if validation error - 422
 *
 * in other cases - 400
 * @param {Object} error - error object
 */
function getStatus(error) {
  if (error.statusCode) return error.statusCode
  if (error.validation) return 422

  return 400
}

module.exports = getStatus
