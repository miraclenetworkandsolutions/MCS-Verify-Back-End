const sequelize =require('sequelize');
const db = require('../util/database');


const Course = db.define('course',{
    courseCode:{
        type: sequelize.INTEGER(10),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    courseTitle:{
        type: sequelize.STRING(10),
        allowNull: false,
    },
    courseDescription:{
        type: sequelize.STRING(100),
        allowNull: true,
    },

    userName:{
        type: sequelize.STRING(10),
        allowNull: false,

    },

    certTitle:{
        type: sequelize.STRING(100),
        allowNull: false,
    },
    certDescription:{
        type: sequelize.STRING(100),
        allowNull: true,
    }
    
},
    { freezeTableName: true }

);



module.exports = Course;