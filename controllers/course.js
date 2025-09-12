const Course = require('../models/course');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const sequelize = require('../util/database');
const { Op } = require('sequelize');

exports.createCourse = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'validation errors',
                errors: errors.array()
            });
        }

        const {
            courseTitle,
            courseDescription,
            userName,
            certTitle,
            certDescription
        } = req.body;

        const user = await User.findByPk(userName);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        const existingCourse = await Course.findOne({ where: { courseTitle: courseTitle, userName: userName } });
        if (existingCourse) {
            return res.status(400).json({
                success: false,
                message: "Course with this title already exists for this user"
            });
        }

        const newCourse = await Course.create({
            courseTitle,
            courseDescription,
            userName,
            certTitle,
            certDescription
        });

        res.status(201).json({
            success: true,
            message: "Course Created Successfully",
            data: newCourse
        });

    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({
            success: false,
            message: "Creating Course Failed",
            error: error.message
        });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.findAll({
            include: [{
                model: User,
                attributes: ['userName']
            }]
        });

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Fetching Courses Failed",
            error: error.message
        });
    }
};

// get course using id
exports.getCourseById = async (req, res) => {
    try {
        const { courseCode } = req.params;
        const course = await Course.findByPk(courseCode, {
            include: [{
                model: User,
                attributes: ['userName']
            }]
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course Not Found"
            });
        }

        res.status(200).json({
            success: true,
            data: course
        });

    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({
            success: false,
            message: "Fetching Course Failed",
            error: error.message
        });
    }
};

exports.updateCourse = async (req, res) => {
    const t = await sequelize.transaction();
    const errors = validationResult(req);

    try {
        const { courseCode } = req.params;
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'validation errors',
                errors: errors.array()
            });
        }

        const {
            courseTitle,
            courseDescription,
            userName,
            certTitle,
            certDescription
        } = req.body;

        const course = await Course.findByPk(courseCode);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course Not Found'
            });
        }

        // Check if course title already exists for another course by same user
        if (req.body.courseTitle && req.body.courseTitle !== course.courseTitle) {
            const existingCourse = await Course.findOne({
                where: { 
                    courseTitle: req.body.courseTitle,
                    userName: req.body.userName || course.userName,
                    courseCode: { [Op.ne]: courseCode }
                }
            });
            if (existingCourse) {
                await t.rollback();
                return res.status(400).json({
                    success: false,
                    message: "Course with this title already exists for this user"
                });
            }
        }

        const updatedCourse = await course.update({
            courseTitle,
            courseDescription,
            userName,
            certTitle,
            certDescription
        }, { transaction: t });

        await t.commit();

        res.status(200).json({
            success: true,
            message: "Course Updated Successfully",
            data: updatedCourse
        });

    } catch (error) {
        console.error('Error updating course:', error);
        await t.rollback();
        res.status(500).json({
            success: false,
            message: "Updating Course Failed",
            error: error.message
        });
    }
};

exports.deleteCourse = async (req, res, next) => {
    const t = await sequelize.transaction();

    try {
        const courseCode = req.params.courseCode;

        const course = await Course.findByPk(courseCode);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        await Course.destroy({
            where: { courseCode: courseCode },
            transaction: t
        });

        await t.commit();

        res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        });

    } catch (err) {
        console.error('Error deleting course:', err);
        await t.rollback();

        res.status(500).json({
            success: false,
            message: "Error deleting course",
            error: err.message
        });
    }
};

// pagination
exports.CourseSearch = async (req, res) => {
    const pageNo = parseInt(req.params.pageNo);
    const numOfLine = parseInt(req.params.numOfLine);
    let searchText = req.params.searchText ? req.params.searchText.toString() : "";

    // Debug logs
    console.log('Search Parameters:');
    console.log('PageNo:', pageNo);
    console.log('NumOfLine:', numOfLine);
    console.log('SearchText:', searchText);
    console.log('SearchText type:', typeof searchText);

    try {
        // Handle "*" for all records
        if (searchText === "*") {
            searchText = "";
        }

        // Handle empty or null search text - but still return results
        if (searchText === "null" || searchText === undefined) {
            searchText = "";
        }

        let dynamicWhere = [];

        // If searchText is not empty, add search conditions
        if (searchText !== "") {
            console.log('Adding search conditions for:', searchText);
            dynamicWhere.push(
                { courseTitle: { [Op.like]: `%${searchText}%` } },
                { courseDescription: { [Op.like]: `%${searchText}%` } },
                { userName: { [Op.like]: `%${searchText}%` } },
                { certTitle: { [Op.like]: `%${searchText}%` } },
                { certDescription: { [Op.like]: `%${searchText}%` } }
            );
        }

        // Build where clause
        const whereClause = dynamicWhere.length > 0 ? { [Op.or]: dynamicWhere } : {};

        console.log('Where clause:', JSON.stringify(whereClause, null, 2));

        // Get counts
        const totalCount = await Course.count();
        console.log('Total count:', totalCount);

        const filteredCount = await Course.count({ where: whereClause });
        console.log('Filtered count:', filteredCount);

        // Calculate pagination
        const offset = (pageNo - 1) * numOfLine;
        console.log('Offset:', offset);
        console.log('Limit:', numOfLine);

        // Get courses
        const courses = await Course.findAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    attributes: ['userName', 'firstName', 'lastName']
                }
            ],
            order: [['createdAt', 'ASC']],
            offset: offset,
            limit: numOfLine
        });

        console.log('Found courses:', courses.length);

        res.status(200).json({
            success: true,
            data: courses,
            pageCount: filteredCount,
            allCount: totalCount,
            currentPage: pageNo,
            totalPages: Math.ceil(filteredCount / numOfLine)
        });

    } catch (err) {
        console.error('Error searching courses:', err);
        res.status(500).json({
            success: false,
            message: "Error searching courses",
            error: err.message
        });
    }
};