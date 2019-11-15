const { STRING, INTEGER, DATE } = require('sequelize')
const Database = require('../engine/database')
const Plans = require('./plans')

const clients = Database.define('clients', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: INTEGER
  },
  name: { type: STRING, allowNull: false },
  api_key: { type: STRING, allowNull: false },
  plan_id: {
    type: INTEGER,
    allowNull: false,
    references: {
      model: Plans,
      key: 'id'
    }
  },
  secret: {
    type: STRING,
    allowNull: false
  },
  expired_at: { type: DATE, allowNull: false }
})

module.exports = clients
