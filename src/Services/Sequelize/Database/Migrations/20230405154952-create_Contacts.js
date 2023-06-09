'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('Contacts', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      value: {
        type: Sequelize.STRING,
        allowNull: false
      },
      env_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Environments', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Clients', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      comments: {
        type: Sequelize.STRING,
        allowNull: true
      },
      params: {
        type: Sequelize.JSON,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Contacts');
  }
};
