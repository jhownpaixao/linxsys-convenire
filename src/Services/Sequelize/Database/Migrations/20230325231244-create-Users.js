'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      env_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Environments', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      picture: {
        unique: true,
        type: Sequelize.STRING,
        allowNull: true
      },
      pass: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        unique: true,
        type: Sequelize.STRING,
        allowNull: true
      },
      uniqkey: {
        unique: true,
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('Administrator', 'Default', 'SuperAdmin', 'Operator'),
        defaultValue: 'Default',
        allowNull: false
      },
      block_with_venc: {
        type: Sequelize.ENUM('Yes', 'No'),
        defaultValue: 'Yes',
        allowNull: false
      },
      blocked: {
        type: Sequelize.ENUM('Yes', 'No'),
        defaultValue: 'No',
        allowNull: false
      },
      group_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      date_venc: {
        type: Sequelize.DATE,
        allowNull: false
      },
      params: {
        type: Sequelize.JSON,
        allowNull: true
      },
      auth_token: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      loged_at: {
        type: Sequelize.DATE,
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
    return queryInterface.dropTable('Users');
  }
};
