// const { validationResult } = require("express-validator");
// const sequelize = require("../util/database");
// const { Op } = require("sequelize");

// // Import all necessary models
// const CourseEnrollment = require("../models/course_enrollment");
// const Student = require("../models/student");
// const Institute = require("../models/institute");
// const User = require("../models/user");

// // Get a single course enrollment by its ID
// exports.getEnrollment = async (req, res, next) => {
//   const enrollId = req.params.enrollId;

//   try {
//     const enrollment = await CourseEnrollment.findByPk(enrollId, {
//       // Include associated data from other tables, which is very useful for a join table
//       include: [
//         { model: Student },
//         { model: Institute },
//         { model: User, attributes: ['userName', 'firstName', 'lastName'] } // Exclude sensitive data like passwords
//       ]
//     });

//     if (!enrollment) {
//       const error = new Error("Could not find course enrollment.");
//       error.statusCode = 404;
//       throw error;
//     }

//     res.status(200).json(enrollment);

//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// // // Get all course enrollments
// // exports.getEnrollments = async (req, res, next) => {
// //   try {
// //     const enrollments = await CourseEnrollment.findAll({
// //         include: [
// //             { model: Student, attributes: ['studentId', 'firstName', 'surName'] },
// //             { model: Institute, attributes: ['instCode', 'iName'] },
// //         ]
// //     });

// //     if (enrollments.length === 0) {
// //       const error = new Error("Could not find any course enrollments.");
// //       error.statusCode = 404;
// //       throw error;
// //     }

// //     res.status(200).json(enrollments);

// //   } catch (err) {
// //     if (!err.statusCode) {
// //       err.statusCode = 500;
// //     }
// //     next(err);
// //   }
// // };

// // // Add a new course enrollment (POST)
// // exports.addEnrollment = async (req, res, next) => {
// //   const t = await sequelize.transaction();
// //   const errors = validationResult(req);

// //   try {
// //     if (!errors.isEmpty()) {
// //       const error = new Error("Validation failed; entered data is incorrect.");
// //       error.statusCode = 422;
// //       error.data = errors.array();
// //       throw error;
// //     }

// //     const { stuId, courseCode, instCode, enrollDate, userName, isActive } = req.body;

// //     // --- Foreign Key Validation ---
// //     // Before creating, ensure the referenced records actually exist.
// //     const student = await Student.findByPk(stuId);
// //     if (!student) {
// //         const error = new Error(`Student with ID ${stuId} does not exist.`);
// //         error.statusCode = 400; // Bad Request
// //         throw error;
// //     }

// //     const institute = await Institute.findByPk(instCode);
// //     if (!institute) {
// //         const error = new Error(`Institute with code ${instCode} does not exist.`);
// //         error.statusCode = 400;
// //         throw error;
// //     }
// //     // You would add a similar check for courseCode once you have a Course model.

// //     await CourseEnrollment.create(
// //       { stuId, courseCode, instCode, enrollDate, userName, isActive },
// //       { transaction: t }
// //     );

// //     await t.commit();

// //     res.status(201).json({
// //       message: "Course enrollment created successfully!",
// //     });

// //   } catch (err) {
// //     await t.rollback();
// //     if (!err.statusCode) {
// //       err.statusCode = 500;
// //     }
// //     next(err);
// //   }
// // };

// // // Update a course enrollment (PUT)
// // exports.updateEnrollment = async (req, res, next) => {
// //     const t = await sequelize.transaction();
// //     const errors = validationResult(req);
  
// //     try {
// //       if (!errors.isEmpty()) {
// //         const error = new Error("Validation failed; entered data is incorrect.");
// //         error.statusCode = 422;
// //         throw error;
// //       }
  
// //       const { enrollId } = req.params;
// //       const { stuId, courseCode, instCode, enrollDate, userName, isActive } = req.body;
  
// //       const enrollment = await CourseEnrollment.findByPk(enrollId);
// //       if (!enrollment) {
// //         const error = new Error("Course enrollment not found.");
// //         error.statusCode = 404;
// //         throw error;
// //       }
  
// //       // You could add foreign key validation here as well if those fields can be updated.
  
// //       await enrollment.update(
// //         { stuId, courseCode, instCode, enrollDate, userName, isActive },
// //         { transaction: t }
// //       );
  
// //       await t.commit();
  
// //       res.status(200).json({
// //         success: true,
// //         message: "Course enrollment updated successfully",
// //         data: enrollment
// //       });
  
// //     } catch (error) {
// //       await t.rollback();
// //       if (!error.statusCode) {
// //         error.statusCode = 500;
// //       }
// //       next(error);
// //     }
// // };

// // // Search enrollments with pagination
// // exports.searchEnrollments = async (req, res, next) => {
// //     try {
// //       const pageNo = parseInt(req.params.pageNo);
// //       const numOfLine = parseInt(req.params.numOfLine);
// //       let searchText = req.params.searchText;
  
// //       let dynamicWhere = [];
// //       if (searchText && searchText !== "null") {
// //         searchText = searchText === "*" ? "" : searchText;
// //         dynamicWhere.push(
// //           { stuId: { [Op.substring]: searchText } },
// //           { courseCode: { [Op.substring]: searchText } },
// //           { instCode: { [Op.substring]: searchText } },
// //           { userName: { [Op.substring]: searchText } }
// //         );
// //       }
  
// //       const whereclause = dynamicWhere.length > 0 ? { [Op.or]: dynamicWhere } : {};
  
// //       const enrollmentList = await CourseEnrollment.findAll({
// //         order: [["enrollDate", "DESC"]],
// //         where: whereclause,
// //         offset: (pageNo - 1) * numOfLine,
// //         limit: numOfLine,
// //       });
  
// //       const pageCount = await CourseEnrollment.count({ where: whereclause });
// //       const allCount = await CourseEnrollment.count();
  
// //       res.status(200).json({
// //         List: enrollmentList,
// //         pageCount: pageCount,
// //         allCount: allCount,
// //       });

// //     } catch (err) {
// //       if (!err.statusCode) {
// //         err.statusCode = 500;
// //       }
// //       next(err);
// //     }
// // };

// // // Delete a course enrollment
// // exports.deleteEnrollment = async (req, res, next) => {
// //     const t = await sequelize.transaction();
  
// //     try {
// //       const { enrollId } = req.params;
  
// //       const enrollment = await CourseEnrollment.findByPk(enrollId);
// //       if (!enrollment) {
// //         const error = new Error("Course enrollment not found.");
// //         error.statusCode = 404;
// //         throw error;
// //       }
  
// //       await enrollment.destroy({ transaction: t });
  
// //       await t.commit();
  
// //       res.status(200).json({
// //         success: true,
// //         message: "Course enrollment deleted successfully"
// //       });
  
// //     } catch (err) {
// //       await t.rollback();
// //       if (!err.statusCode) {
// //         err.statusCode = 500;
// //       }
// //       next(err);
// //     }
// // };
