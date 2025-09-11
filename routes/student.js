const express = require('express');
const { body } = require('express-validator');
//const isAuth = require('../middlewares/is-auth');

const studentController = require('../controllers/student');

const router = express.Router();

// GET
router.get('/student/:studentId', studentController.getStudentById);
router.get('/students', studentController.createStudent);
//router.get('/student_pg/:filter/:NumOfLine/:pageNo', studentController.getStudentPg);
router .get('/student_sh/:searchText/:numOfLine/:pageNo', studentController.StudentSearch);

// // POST
router.post('/student', studentController.createStudent);

// // PUT
router.put('/student/:studentId', studentController.updateStudent);

// // DELETE
router.delete('/student/:studentId', studentController.deleteStudent);

module.exports = router;