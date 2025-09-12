const Sequelize = require('sequelize');
const db = require('../util/database');
const User = require('./user');
// const city = require('./city');

const Institute = db.define('institute', {
  instCode: {
      type: Sequelize.STRING(20),
      allowNull: false,
      primaryKey: true
  },
  iName: {
      type: Sequelize.STRING(100),
      allowNull: false // Assuming name can be optional, change if needed
  },
  address: {
      type: Sequelize.STRING(400),
      allowNull: true
  },
  countryCode: {
      type: Sequelize.STRING(20),
      allowNull: true
  },
  cityCode: {
      type: Sequelize.STRING(20),
      allowNull: true
  },
  logoUrl: {
      type: Sequelize.STRING(500),
      allowNull: true
  },
  shortDescription: {
      type: Sequelize.STRING(1000),
      allowNull: true
  },
  longDescription: {
      type: Sequelize.STRING(2000),
      allowNull: true
  },
  userName: {
      type: Sequelize.STRING(10),
      allowNull: true
  },
  accountName: {
      type: Sequelize.STRING(10),
      allowNull: true
  },
  email: {
      type: Sequelize.STRING(50), // Note: This is very short for an email, consider increasing
      allowNull: true
  },
  contactNo: {
      type: Sequelize.STRING(10),
      allowNull: true
  },
  mobileNo: {
      type: Sequelize.STRING(10),
      allowNull: true
  },
  contactName: {
      type: Sequelize.STRING(10),
      allowNull: true
  }
}, {
  freezeTableName: true
});

// If there are relationships (Foreign Keys), define them here.
// For example, if 'userName' links to the User model:
// const User = require('./user');
// Institute.belongsTo(User, { foreignKey: 'userName' });

module.exports = Institute;
