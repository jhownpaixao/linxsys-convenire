'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('Tickets', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Clients', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      contact_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Contacts', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      chat_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Chats', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      queue_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Queues', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      assessment_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Assessments', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      protocolo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('open', 'closed', 'queue', 'waiting', 'created', 'canceled'),
        defaultValue: 'created',
        allowNull: false
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
    return queryInterface.dropTable('Tickets');
  }
};
