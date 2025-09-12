const Sequelize = require('sequelize');
const db = require('../util/database');
const User = require('./user');

const Student = db.define('student', {
    studentId: {
        type: Sequelize.INTEGER(100),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    initials:{
        type: Sequelize.STRING(100),
        allowNull: false
    },
    firstName:{
        type: Sequelize.STRING(100),
        allowNull: false
    },
    surName:{
        type: Sequelize.STRING(100),
        allowNull: false
    },
    nameOfInitials:{
        type: Sequelize.STRING(100),
        allowNull: false
    },
    gender:{
        type: Sequelize.STRING(10),
        allowNull: true,
    },
    dob:{
        type: Sequelize.DATEONLY,
        allowNull: true,
    },
    address:{
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    cityCode:{
        type: Sequelize.STRING(20),
        allowNull: true,
    },
    countryCode:{
        type: Sequelize.STRING(20),
        allowNull: true,
    },
    nicNo:{
        type: Sequelize.STRING(20),
        allowNull: false,
    },
    passportNo:{
        type: Sequelize.STRING(20),
        allowNull: true,
    },
     userName:{
         type: Sequelize.STRING(100),
       

         allowNull: false,
     },
    studentUserId:{
        type: Sequelize.STRING(10),
        allowNull: false,
    },
    mobileNo:{
        type: Sequelize.STRING(15),
        allowNull: false,
    },
    email:{
        type: Sequelize.STRING(100),
        allowNull: false,

    }
},

    { freezeTableName: true }

);
// User.hasMany(Student,{foreignKey: 'userName'});
// Student.belongsTo(User,{foreignKey: 'userName'});

module.exports = Student;