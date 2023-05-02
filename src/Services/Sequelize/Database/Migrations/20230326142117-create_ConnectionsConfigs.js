'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.createTable('Connection_Profiles', {
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
            chatbot_id: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            default_messages: {
                type: Sequelize.JSON,
                allowNull: true
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
        return queryInterface.dropTable('Connection_Profiles');
    }
};
