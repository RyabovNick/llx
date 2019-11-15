'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const date = new Date()
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ')
    const plans = [
      {
        name: 'Free',
        unique_per_month: 100,
        created_at: date,
        updated_at: date
      }
    ]
    return queryInterface.bulkInsert('plans', plans, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('plans', null, {})
  }
}
