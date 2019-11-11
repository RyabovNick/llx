'use strict'
module.exports = (sequelize, DataTypes) => {
  const clients = sequelize.define(
    'clients',
    {
      name: DataTypes.STRING,
      token: DataTypes.STRING,
      plan_id: DataTypes.INTEGER,
      expired_at: DataTypes.DATE
    },
    {}
  )
  clients.associate = function(models) {
    // associations can be defined here
  }
  return clients
}
