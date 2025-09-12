const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course');
const { body } = require('express-validator');

// // Validation middleware for course creation and updates
// const courseValidation = [
//     body('courseTitle')
//         .notEmpty()
//         .withMessage('Course title is required')
//         .isLength({ max: 10 })
//         .withMessage('Course title must be maximum 10 characters'),
//     body('courseDescription')
//         .optional()
//         .isLength({ max: 100 })
//         .withMessage('Course description must be maximum 100 characters'),
//     body('userName')
//         .notEmpty()
//         .withMessage('Username is required')
//         .isLength({ max: 10 })
//         .withMessage('Username must be maximum 10 characters'),
//     body('certTitle')
//         .notEmpty()
//         .withMessage('Certificate title is required')
//         .isLength({ max: 100 })
//         .withMessage('Certificate title must be maximum 100 characters'),
//     body('certDescription')
//         .optional()
//         .isLength({ max: 100 })
//         .withMessage('Certificate description must be maximum 100 characters')
// ];

// POST /courses - Create a new course
router.post('/courses', courseController.createCourse);

// GET /courses - Get all courses
router.get('/courses', courseController.getAllCourses);


// GET /courses/search/:pageNo/:numOfLine/:searchText - Search courses with pagination
router.get('/courses/search/:pageNo/:numOfLine/:searchText', courseController.CourseSearch);

// GET /courses/:courseCode - Get course by ID
router.get('/courses/:courseCode', courseController.getCourseById);

// PUT /courses/:courseCode - Update course
router.put('/courses/:courseCode', courseController.updateCourse);

// DELETE /courses/:courseCode - Delete course
router.delete('/courses/:courseCode', courseController.deleteCourse);

module.exports = router;