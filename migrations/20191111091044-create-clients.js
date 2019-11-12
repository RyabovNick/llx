'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('clients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      api_key: {
        allowNull: false,
        type: Sequelize.STRING
      },
      plan_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'plans',
          key: 'id'
        }
      },
      secret: {
        allowNull: false,
        type: Sequelize.STRING
      },
      expired_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('clients')
  }
}
