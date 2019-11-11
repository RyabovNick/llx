'use strict'
module.exports = (sequelize, DataTypes) => {
  const plans = sequelize.define(
    'plans',
    {
      name: DataTypes.STRING,
      unique_per_month: DataTypes.INTEGER
    },
    {}
  )
  plans.associate = function(models) {
    // associations can be defined here
  }
  return plans
}
