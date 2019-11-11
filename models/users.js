'use strict'
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define(
    'users',
    {
      token: DataTypes.STRING,
      client_id: DataTypes.INTEGER,
      payload: DataTypes.JSON,
      expired_at: DataTypes.DATE
    },
    {}
  )
  users.associate = function(models) {
    // associations can be defined here
  }
  return users
}
