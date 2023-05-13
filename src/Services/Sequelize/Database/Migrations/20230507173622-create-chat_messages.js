'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('chat_messages', {
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
      chat_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Chats', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      uniqkey: {
        type: Sequelize.STRING,
        allowNull: false
      },
      from: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      level: {
        type: Sequelize.ENUM('default', 'system', 'other'),
        defaultValue: 'default',
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('default', 'media', 'link', 'action'),
        defaultValue: 'default',
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('waiting', 'sent', 'received', 'deleted', 'error'),
        defaultValue: 'waiting',
        allowNull: false
      },
      actions: {
        type: Sequelize.ENUM('default', 'forwarded'),
        defaultValue: 'default',
        allowNull: false
      },
      receivedby: {
        type: Sequelize.JSON,
        allowNull: true
      },
      text: {
        type: Sequelize.STRING,
        allowNull: false
      },
      readby: {
        type: Sequelize.JSON,
        allowNull: true
      },
      attachment: {
        type: Sequelize.JSON,
        allowNull: true
      },
      reactions: {
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
    return queryInterface.dropTable('chat_messages');
  }
};
