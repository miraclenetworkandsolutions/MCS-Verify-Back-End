const Sequelize = require('sequelize');
const db = require('../util/database');
const Student = require('./student');
const User = require('./user');
// const Course = require('./course');
const Institute = require('./institute');


const Certificate = db.define('certificate', {
  certId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true 
  },
  instCode: {
    type: Sequelize.STRING(20),
    allowNull: false,
  },
  courseCode: {
    type: Sequelize.STRING(10),
    allowNull: false,
  },
  stuId: {
    type: Sequelize.STRING(20),
    allowNull: false,
  },
  issueDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  expriryDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  certificateUrl: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  scoreReportUrl: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  userName: {
    type: Sequelize.STRING(20),
    allowNull: false,
  },
  score: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING(10),
    allowNull: true,
  },
  qrUrl: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  //   adminInstitute: {
  //   type: Sequelize.STRING(80),
  //   allowNull: true,
  // },
  
},
  { freezeTableName: true }
);

// Certificate.belongsTo(Student, { foreignKey: 'stuId'})
// Certificate.belongsTo(Institute, { foreignKey: 'instCode'})
// // Certificate.belongsTo(Course, { foreignKey: 'courseCode'})
// Certificate.belongsTo(User, { foreignKey: 'userName'})


module.exports = Certificate;