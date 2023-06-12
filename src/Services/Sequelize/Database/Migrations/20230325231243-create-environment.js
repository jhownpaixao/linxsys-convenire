'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('Environments', {
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
      email: {
        unique: true,
        type: Sequelize.STRING,
        allowNull: true
      },
      isotipo: {
        unique: true,
        type: Sequelize.STRING,
        allowNull: true
      },
      logotipo: {
        unique: true,
        type: Sequelize.STRING,
        allowNull: true
      },
      uniqkey: {
        unique: true,
        type: Sequelize.STRING,
        allowNull: false
      },
      env_token: {
        unique: true,
        type: Sequelize.STRING,
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
      date_venc: {
        type: Sequelize.DATE,
        allowNull: false
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
    return queryInterface.dropTable('Environments');
  }
};
