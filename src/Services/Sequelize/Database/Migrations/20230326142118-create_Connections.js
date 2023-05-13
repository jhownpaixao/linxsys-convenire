'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('Connections', {
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
      connected_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      uniqkey: {
        type: Sequelize.STRING,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      config_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Connection_Profiles', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      blocked: {
        type: Sequelize.ENUM('Yes', 'No'),
        defaultValue: 'No',
        allowNull: false
      },
      params: {
        type: Sequelize.JSON,
        allowNull: true
      },
      comments: {
        type: Sequelize.INTEGER,
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
    return queryInterface.dropTable('Connections');
  }
};
