const { STRING, INTEGER } = require('sequelize')
const Database = require('../engine/database')

const plans = Database.define('plans', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: INTEGER
  },
  name: STRING,
  unique_per_month: INTEGER
})

module.exports = plans
