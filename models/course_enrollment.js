const Sequelize = require('sequelize');
const db = require('../util/database');
const Student = require('./student');
const Institute = require('./institute');
const User = require('./user');

const Course_enrollment = db.define('course_enrollment', {
    enrollId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    stuId: {
        type: Sequelize.STRING(20), // This is the problem line
        allowNull: false,
    },
    courseCode: {
        type: Sequelize.STRING(10),
        allowNull: false,
    },
    instCode: {
        type: Sequelize.STRING(20),
        allowNull: false,
    },
    enrollDate: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    userName: {
        type: Sequelize.STRING(45),
        allowNull: false,
    },
    isActive: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'Y' // It's good practice to set a default for status fields
    }
}, {
    freezeTableName: true
});

// Course_enrollment.belongsTo(Student, { foreignKey: 'stuId' });
// Course_enrollment.belongsTo(Institute, { foreignKey: 'instCode' });
// Course_enrollment.belongsTo(User, { foreignKey: 'userName' });

module.exports = Course_enrollment;