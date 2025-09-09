const Sequelize = require('sequelize');
const db = require('../util/database');
const User = require('./user');

const City = db.define('city', {
    cityCode: {
        type: Sequelize.STRING(45),
        allowNull: false,
        primaryKey: true
    },
    description: {
        type: Sequelize.STRING(1045),
        allowNull: true
    },
    postalcode: {
        type: Sequelize.INTEGER(45),
        allowNull: true
    },
    seq: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
},
    { freezeTableName: true });

User.hasMany(City, { onDelete: 'RESTRICT', onUpdate: 'CASCADE', foreignKey: 'userName' });
City.belongsTo(User, { foreignKey: 'userName' });

module.exports = City;