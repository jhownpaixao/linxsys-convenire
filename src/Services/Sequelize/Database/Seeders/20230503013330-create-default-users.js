'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            'Users',
            [
                {
                    id: 1,
                    name: 'Administrador',
                    uniqkey: '088939ee-29e4-4d8e-8a1f-e8d50277d767',
                    email: 'admin@admin.com',
                    pass: '$2b$10$0uO/qKIE8NCs4Iz1XQuv0u0JZEAxMeJY8XYnXADZRzy.TUpuqs7wS',
                    type: 'Administrator',
                    block_with_venc: 'No',
                    date_venc: '2031-07-31 00:00:00',
                    updated_At: '2023-05-03 01:42:19',
                    created_At: '2023-05-03 01:42:19'
                }
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Users', null, {});
    }
};
