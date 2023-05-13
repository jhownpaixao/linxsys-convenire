'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('Assessments', {
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
      for_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      comments: {
        type: Sequelize.STRING,
        allowNull: true
      },
      note: {
        type: Sequelize.STRING,
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
    return queryInterface.dropTable('Assessments');
  }
};
