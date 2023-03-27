'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('connections', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      queues: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      config_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: { model: 'connections_configs', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      uniqkey: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      /* type: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'connections_types', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }, */
      blocked: {
        type: Sequelize.ENUM('Yes', 'No'),
        defaultValue: 'No',
        allowNull: false,
      },
      data: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      /*       auth_token: {
              type: Sequelize.STRING,
              allowNull: true,
            }, */
      jid: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      comments: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('connections');
  }
};
