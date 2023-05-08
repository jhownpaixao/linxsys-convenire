'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.createTable('Chats', {
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
            owner_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            channel: {
                type: Sequelize.STRING,
                allowNull: false
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            type: {
                type: Sequelize.ENUM('group', 'private'),
                defaultValue: 'private',
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
        return queryInterface.dropTable('Chats');
    }
};
