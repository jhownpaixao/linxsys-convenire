'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('Clients', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      nome: {
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

      nascimento: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      cpf: {
        type: Sequelize.STRING,
        allowNull: true
      },
      rg: {
        type: Sequelize.STRING,
        allowNull: true
      },

      cep: {
        type: Sequelize.STRING,
        allowNull: true
      },
      end: {
        type: Sequelize.STRING,
        allowNull: true
      },
      end_num: {
        type: Sequelize.STRING,
        allowNull: true
      },
      bairro: {
        type: Sequelize.STRING,
        allowNull: true
      },
      cidade: {
        type: Sequelize.STRING,
        allowNull: true
      },
      uf: {
        type: Sequelize.STRING,
        allowNull: true
      },
      group_id: {
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
    await queryInterface.dropTable('Clients');
  }
};
