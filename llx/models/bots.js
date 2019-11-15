const { STRING, INTEGER } = require('sequelize')
const Database = require('../engine/database')

const bots = Database.define('bots', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: INTEGER
  },
  username: DataTypes.STRING,
  password: DataTypes.STRING,
  description: DataTypes.STRING
})

module.exports = bots
