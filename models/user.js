const Sequelize = require('sequelize');
const db = require('../util/database');


const User = db.define('user', {
    userName: {
        type: Sequelize.STRING(45),
        allowNull: false,
        primaryKey: true
    },
    userPW: {
        type: Sequelize.STRING(245),
        allowNull: true,
    },
    firstName: {
        type: Sequelize.STRING(45),
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING(45),
        allowNull: false
    },
    address: {
        type: Sequelize.STRING(245),
        allowNull: false
    },
    contactNo: {
        type: Sequelize.STRING(45),
        allowNull: true
    },
    whatsAppNo: {
        type: Sequelize.STRING(45),
        allowNull: true
    },
    email: {
        type: Sequelize.STRING(145),
        allowNull: true
    },
    nicNo: {
        type: Sequelize.STRING(45),
        allowNull: true
    },
    createdBy: {
        type: Sequelize.STRING(645),
        allowNull: true
    },
    isActive: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ['Y', 'N'],
        defaultValue: 'Y'
    },
    userLevel: {
        type: Sequelize.STRING(45),
        allowNull: false,
        values: ['SysAdmin', 'SuperAdmin', 'Admin', 'student'],
    }
    
},
    { freezeTableName: true }
);


module.exports = User;