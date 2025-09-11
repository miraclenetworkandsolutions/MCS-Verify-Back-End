const Student =require('../models/student');
const User =require('../models/user');
const {validationResult}= require('express-validator');
const sequelize = require('../util/database');
const { Op } = require('sequelize');

exports.createStudent=async(req,res)=>{
    
   try{
    const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                succes:false,
                message:'validation errors',
                errors:errors.array()
            });
        }
        const{
            initials,
            firstName,
            surName,
            nameOfInitials,
            gender,
            dob,
            address,
            cityCode,
            countryCode,
            nicNo,
            passportNo,
            userName,
            studentUserId,
            mobileNo,
            email,
            

        }=req.body;

        const user=await User.findByPk(userName);
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            });     
        }
        const existingStudent=await Student.findOne({where:{nicNo:nicNo}});
        if(existingStudent){
            return res.status(400).json({
                success:false,
                message:"Student with this NIC No already exists"
            });
        }
           

    

        const newStudent=await Student.create({
            initials,
            firstName,
            surName,
            nameOfInitials,
            gender,
            dob,
            address,
            cityCode,
            countryCode,
            nicNo,
            passportNo,
            userName,
            studentUserId,
            mobileNo,
            email
        });
        res.status(201).json({
            success:true,
            message:"Student Created Successfully",
            data:newStudent
        });
    }catch(error){
        console.error('Error creating student:',error);
        res.status(500).json({
            success:false,
            message:"Creating Student Failed",
            error:error.message
        });
    }
};

// exports.getAllStudents=async(req,res)=>{
//     try{
//         const students=await Student.findAll({
//             include:[{
//                 model:User,
//                 attributes:['userName']
//             }]
//         });
//         res.status(200).jason({
//             success:true,
//             count:student.length,
//             data:students
//         });

        
//     }catch (error){
//         console.error(error);
//         res.status(500).json({
//             success:false,
//             message:"Fetching Students Failed",
//             error:error.message
//         });
//     }
// };

//get student using id
exports.getStudentById=async(req,res)=>{
    try{
        const {studentId}=req.params;
        const student =await Student.findByPk(studentId,{
            include:[{
                model:User,
                attributes:['userName']
            }]
        });

        if(!student){
            return res.status(404).json({
                success:false,
                message:"Student Not Found"
            });
        }

        res.status(200).json({
            success:true,
            data:student
        });
    }catch (error){
        console.error('Error fetching student:',error);
        res.status(500).json({
            success:false,
            message:"Fetching Student Failed",
            error:error.message
        });
    }
  
};

exports.updateStudent=async(req,res)=>{
    const t = await sequelize.transaction();
    const errors = validationResult(req);

    try{
        const{ studentId}=req.params;
        if(!errors.isEmpty()){
            return res.status(400).json({
                succes:false,
                message:'validation errors',
                errors:errors.array()
            });


        }

        const{
            initials,
            firstName,
            surName,
            nameOfInitials,
            gender,
            dob,
            address,
            cityCode,
            countryCode,
            nicNo,
            passportNo,
            userName,
            studentUserId,
            mobileNo,
            email
        }=req.body;
        const student=await Student.findByPk(studentId);
        if(!student){
            return res.status(404).json({
                success:false,
                message:'Student Not Found',
                errors:errors.array()
            });
        }

        if (req.body.nicNo && req.body.nicNo !== student.nicNo) {
            const existingStudent = await Student.findOne({
                where: { nicNo: req.body.nicNo }
            });
            if (existingStudent) {
                await t.rollback();
                return res.status(400).json({
                    success: false,
                    message: "Student with this NIC No already exists"
                });
            }
        }
        const updatedStudent=await student.update({
            initials,
            firstName,
            surName,
            nameOfInitials,
            gender,
            dob,
            address,
            cityCode,
            countryCode,
            nicNo,
            passportNo,
            userName,
            studentUserId,
            mobileNo,
            email   
        },{transaction:t});

        await t.commit();

        res.status(200).json({
            success:true,
            message:"Student Updated Successfully",
            data:updatedStudent
        });

    }catch (error){
        console.error('Error updating student:',error);
        await t.rollback();
        res.status(500).json({
            success:false,
            message:"Updating Student Failed",
            error:error.message
        });
    }
       
};
exports.deleteStudent = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const studentId = req.params.studentId;

    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    await Student.destroy({
      where: { studentId: studentId },
      transaction: t
    });

    await t.commit();

    res.status(200).json({
      success: true,
      message: "Student deleted successfully"
    });

  } catch (err) {
    console.error('Error deleting student:', err);
    await t.rollback();
    
    res.status(500).json({
      success: false,
      message: "Error deleting student",
      error: err.message
    });
  }
};

//pageination
exports.StudentSearch = async (req, res) => {
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
                { initials: { [Op.like]: `%${searchText}%` } },
                { firstName: { [Op.like]: `%${searchText}%` } },
                { surName: { [Op.like]: `%${searchText}%` } },
                { nameOfInitials: { [Op.like]: `%${searchText}%` } },
                { gender: { [Op.like]: `%${searchText}%` } },
                { address: { [Op.like]: `%${searchText}%` } },
                { cityCode: { [Op.like]: `%${searchText}%` } },
                { countryCode: { [Op.like]: `%${searchText}%` } },
                { nicNo: { [Op.like]: `%${searchText}%` } },
                { passportNo: { [Op.like]: `%${searchText}%` } },
                { userName: { [Op.like]: `%${searchText}%` } },
                { studentUserId: { [Op.like]: `%${searchText}%` } },
                { mobileNo: { [Op.like]: `%${searchText}%` } },
                { email: { [Op.like]: `%${searchText}%` } }
            );
        }

        // Build where clause
        const whereClause = dynamicWhere.length > 0 ? { [Op.or]: dynamicWhere } : {};
        
        console.log('Where clause:', JSON.stringify(whereClause, null, 2));

        // Get counts
        const totalCount = await Student.count();
        console.log('Total count:', totalCount);

        const filteredCount = await Student.count({ where: whereClause });
        console.log('Filtered count:', filteredCount);

        // Calculate pagination
        const offset = (pageNo - 1) * numOfLine;
        console.log('Offset:', offset);
        console.log('Limit:', numOfLine);

        // Get students
        const students = await Student.findAll({
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

        console.log('Found students:', students.length);

        res.status(200).json({
            success: true,
            data: students,
            pageCount: filteredCount,
            allCount: totalCount,
            currentPage: pageNo,
            totalPages: Math.ceil(filteredCount / numOfLine)
        });

    } catch (err) {
        console.error('Error searching students:', err);
        res.status(500).json({
            success: false,
            message: "Error searching students",
            error: err.message
        });
    }
};