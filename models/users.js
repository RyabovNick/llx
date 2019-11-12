const { STRING, INTEGER, DATE, JSON } = require('sequelize')
const Database = require('../engine/database')
const Clients = require('./clients')

const users = Database.define('users', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: INTEGER
  },
  token: STRING,
  client_id: {
    allowNull: false,
    type: INTEGER,
    references: {
      model: Clients,
      key: 'id'
    }
  },
  payload: JSON,
  expired_at: DATE
})

module.exports = users
