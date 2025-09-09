const Sequelize = require('sequelize');
const mysql = require('mysql2/promise');

const sequelize = new Sequelize(
    `${process.env.MYSQL_DATABASE}`,
    `${process.env.MYSQL_USER}`,
    `${process.env.MYSQL_PASSWORD}`,
    {
        dialect: 'mysql',
        define: {
            charset: 'utf8',
            collate: 'utf8_general_ci',
        },
        dialectOptions: { // for reading
            useUTC: false,
            timezone: 'Asia/Colombo'
        },
        host: `${process.env.MYSQL_HOST}`,
        useUTC: false,
        timezone: 'Asia/Colombo'
    }
);


console.log(`${process.env.MYSQL_HOST}` + '   **********************');
console.log(`${process.env.MYSQL_DATABASE}` + '   **********************');
console.log(`${process.env.MYSQL_USER}` + '   **********************');
console.log(`${process.env.MYSQL_PASSWORD}` + '   **********************');
module.exports = sequelize;