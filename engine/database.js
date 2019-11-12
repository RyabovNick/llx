require('dotenv').config({
  path: '.env.local'
})

const Sequelize = require('sequelize')

const database = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USERNAME,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOSTNAME,
    port: process.env.MYSQL_PORT,
    dialect: 'mysql',

    pool: {
      max: 25,
      min: 2,
      acquire: 30000,
      idle: 60000,
      evict: 60000
    },

    sync: {
      alter: false
    },

    define: {
      freezeTableName: true,
      underscored: true
    },
    logging: false
  }
)

module.exports = database
