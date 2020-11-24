const { Sequelize } = require('sequelize');

const db = new Sequelize('postgres', 'alexander', '1qazXsw2',{
    host: 'localhost',
    dialect: 'postgres',

    pool: {
        max:5,
        min: 0
    }
});

exports.db = db;