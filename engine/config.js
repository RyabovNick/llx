/**
 * database config for sequelize migration
 */
require('dotenv').config({
  path: '.env.local'
})

module.exports = {
  development: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DEV_DB,
    host: process.env.MYSQL_HOSTNAME,
    port: process.env.MYSQL_PORT,
    dialect: 'mysql',
    seederStorage: 'sequelize'
  },
  production: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_PROD_DB,
    host: process.env.MYSQL_HOSTNAME,
    port: process.env.MYSQL_PORT,
    dialect: 'mysql',
    seederStorage: 'sequelize'
  }
}
