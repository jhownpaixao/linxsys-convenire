'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('Chatbots', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      queues: {
        type: Sequelize.JSON,
        allowNull: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      default_messages: {
        type: Sequelize.JSON,
        allowNull: true
      },
      blocked: {
        type: Sequelize.ENUM('Yes', 'No'),
        defaultValue: 'No',
        allowNull: false
      },
      workflow_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Workflows', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      comments: {
        type: Sequelize.INTEGER,
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
    return queryInterface.dropTable('Chatbots');
  }
};
