// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
module.exports = {
    dialect: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'convenire_nodeapi',
    define: {
        timestamps: true,
        underscored: true
    },
    models: ['../../models'] // or [Player, Team],
};
