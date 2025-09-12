const { validationResult } = require("express-validator");
const sequelize = require("../util/database");
const Institute = require("../models/institute");
const User = require("../models/user"); // Assuming userName is a foreign key
const { Op } = require("sequelize");

// Get institute
exports.getInstitute = async (req, res, next) => {
  const instCode = req.params.instCode;

  try {
    // Check if instCode is provided
    if (!instCode) {
      const error = new Error("instCode parameter is required.");
      error.statusCode = 400;
      throw error;
    }

    const institute = await Institute.findOne({
      where: { instCode: instCode },
    });

    // Correct check: if the institute is null (not found)
    if (!institute) {
      const error = new Error("Could not find institute.");
      error.statusCode = 404;
      throw error; // This will be caught by the catch block
    }

    res.status(200).json(institute);

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err); // Pass the error to your error-handling middleware
  }
};

// Get a list of all institutes
exports.getInstitutes = async (req, res, next) => {
  try {
    const institutes = await Institute.findAll();
    
    if (institutes.length === 0) {
      return res.status(200).json({
        message: "No institutes found",
        data: []
      });
    }
    
    res.status(200).json(institutes);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Add a new institute (POST)
exports.addInstitute = async (req, res, next) => {
  const t = await sequelize.transaction();
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, Entered data is incorrect");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const {
      instCode, iName, address, countryCode, cityCode, logoUrl,
      shortDescription, longDescription, userName, accountName,
      email, contactNo, mobileNo, contactName
    } = req.body;

    // Optional: Check if userName exists in User table (if it's a foreign key)
    if (userName) {
      const userExists = await User.findByPk(userName);
      if (!userExists) {
        const error = new Error("The provided userName does not exist in user table.");
        error.statusCode = 400;
        throw error;
      }
    }

    const newInstitute = await Institute.create({
      instCode, iName, address, countryCode, cityCode, logoUrl,
      shortDescription, longDescription, userName, accountName,
      email, contactNo, mobileNo, contactName
    }, { transaction: t });

    await t.commit();

    res.status(201).json({
      message: "Institute created successfully!",
      data: newInstitute // Include the created institute data
    });

  } catch (err) {
    await t.rollback();
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Update institute (PUT)
exports.updateInstitute = async (req, res, next) => {
  // DEBUGGING LINE: Log the received parameter to the console
  console.log(`>>>> Received instCode From URL: [${req.params.instCode}]`);

  // Start a transaction for data integrity
  const t = await sequelize.transaction();
  const errors = validationResult(req);

  try {
    // 1. Validate incoming data based on your router's validation rules
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed; the entered data is incorrect.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error; // Propagate to the catch block
    }

    // 2. Extract the institute's primary key from the URL parameters
    const { instCode } = req.params;

    // 3. Extract all updatable fields from the request body
    const {
      iName, address, countryCode, cityCode, logoUrl,
      shortDescription, longDescription, userName, accountName,
      email, contactNo, mobileNo, contactName
    } = req.body;

    // 4. Find the existing institute record to update
    const institute = await Institute.findByPk(instCode);

    // If no institute is found, throw a 404 error
    if (!institute) {
      const error = new Error("Could not find an institute with that code.");
      error.statusCode = 404;
      throw error;
    }

    // 5. Optional Foreign Key Check: If userName is being changed, verify it exists
    if (userName && userName !== institute.userName) {
      const userExists = await User.findByPk(userName);
      if (!userExists) {
        const error = new Error("Update failed: The provided userName does not exist.");
        error.statusCode = 400; // Bad Request
        throw error;
      }
    }

    // 6. Update the institute instance with the new data
    const updatedInstitute = await institute.update({
      iName, address, countryCode, cityCode, logoUrl,
      shortDescription, longDescription, userName, accountName,
      email, contactNo, mobileNo, contactName
    }, { transaction: t });

    // 7. If the update is successful, commit the transaction
    await t.commit();

    // 8. Send a success response with the updated data
    res.status(200).json({
      message: "Institute updated successfully!",
      data: updatedInstitute
    });

  } catch (err) {
    // 9. If any error occurs, roll back the transaction
    await t.rollback();
    
    // Pass the error to your centralized error-handling middleware
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


