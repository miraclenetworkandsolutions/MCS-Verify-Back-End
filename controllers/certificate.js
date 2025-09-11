const { validationResult } = require("express-validator");
const { encode } = require("../middlewares/crypt");
const sequelize = require("../util/database");
const Certificate = require("../models/certificate");
const User = require("../models/user");
const { Op } = require("sequelize");

// Get certificate

exports.getCertificate = async (req, res, next) => {
  const certId = req.params.certId;

  try {
    const certificate = await Certificate.findOne({
      where: { certId: certId },
    });

    // Correct check: if the certificate is null (not found)
    if (!certificate) {
      const error = new Error("Could not find certificates.");
      error.statusCode = 404;
      throw error; // This will be caught by the catch block
    }

    res.status(200).json(certificate);

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err); // Pass the error to your error-handling middleware
  }
};

// Get all certificates 

exports.getCertificates = async (req, res, next) => {

  await Certificate.findAll()

    .then((result) => {
      if (result.length == 0) {
        const error = new Error("Could not find certificates.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(result);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      if (err.original == null) {
        next(err);
      } else {
        next(err.original);
      }
    });
};

// Add a user (POST)

exports.addCertificate = async (req, res, next) => {
  const t = await sequelize.transaction();
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, Entered data is incorrect");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const certId = req.body.certId;
    const instCode = req.body.instCode;
    const courseCode = req.body.courseCode;
    const stuId = req.body.stuId;
    const issueDate = req.body.issueDate;
    const expriryDate = req.body.expriryDate;
    const certificateUrl = req.body.certificateUrl;
    const scoreReportUrl = req.body.scoreReportUrl;
    const userName = req.body.userName;
    const score = req.body.score;
    const status = req.body.status;
    const qrUrl = req.body.qrUrl;

    await Certificate.create({
      certId: certId,
      instCode: instCode,
      courseCode: courseCode,
      stuId: stuId,
      issueDate: issueDate,
      expriryDate: expriryDate,
      certificateUrl: certificateUrl,
      scoreReportUrl: scoreReportUrl,
      userName: userName,
      score: score,
      status: status,
      qrUrl: qrUrl,
    },
    { transaction: t }
  );

    await t.commit();

    res.status(201).json({
      message: "Success",
    });
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    await t.rollback();

    if (err.original == null) {
      next(err);
    } else {
      next(err.original);
    }
  }
};

// Update certificate (PUT)

exports.updateCertificate = async (req, res) => {
  const t = await sequelize.transaction();
  const errors = validationResult(req);

  try {
    // 1. Validate incoming data
    if (!errors.isEmpty()) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    // 2. Extract certificate ID from URL parameters
    const { certId } = req.params;

    // 3. Extract all updatable fields from the request body
    const {
      instCode,
      courseCode,
      stuId,
      issueDate,
      expriryDate,
      certificateUrl,
      scoreReportUrl,
      userName,
      score,
      status,
      qrUrl
    } = req.body;

    // 4. Find the certificate to be updated
    const certificate = await Certificate.findByPk(certId);
    if (!certificate) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Certificate Not Found'
      });
    }

    // 5. (Important) Foreign Key Check: Before updating, ensure the new userName exists
    if (userName && userName !== certificate.userName) {
      const userExists = await User.findByPk(userName);
      if (!userExists) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: "Update failed: The provided userName does not exist in the user table."
        });
      }
    }

    // 6. Update the certificate instance with new data
    const updatedCertificate = await certificate.update({
      instCode,
      courseCode,
      stuId,
      issueDate,
      expriryDate,
      certificateUrl,
      scoreReportUrl,
      userName,
      score,
      status,
      qrUrl
    }, { transaction: t });

    // 7. Commit the transaction
    await t.commit();

    // 8. Send success response
    res.status(200).json({
      success: true,
      message: "Certificate Updated Successfully",
      data: updatedCertificate
    });

  } catch (error) {
    console.error('Error updating certificate:', error);
    await t.rollback();
    res.status(500).json({
      success: false,
      message: "Updating Certificate Failed",
      error: error.message
    });
  }
};

// Search with pagination

exports.searchCertificates = async (req, res, next) => {
  try {
    const pageNo = parseInt(req.params.pageNo);
    const numOfLine = parseInt(req.params.numOfLine);
    let searchText = req.params.searchText;

    // Build the search conditions dynamically
    let dynamicWhere = [];
    if (searchText && searchText !== "null") {
      searchText = searchText === "*" ? "" : searchText;
      dynamicWhere.push(
        { instCode: { [Op.substring]: searchText } },
        { courseCode: { [Op.substring]: searchText } },
        { stuId: { [Op.substring]: searchText } },
        { userName: { [Op.substring]: searchText } },
        { status: { [Op.substring]: searchText } }
      );
    }

    // Combine search conditions with an OR operator
    const whereclause = dynamicWhere.length > 0 ? { [Op.or]: dynamicWhere } : {};

    // Fetch the paginated list of certificates
    const certificateList = await Certificate.findAll({
      order: [["issueDate", "DESC"]], // Order by most recent issue date
      where: whereclause,
      offset: (pageNo - 1) * numOfLine,
      limit: numOfLine,
    });

    // Get the total count of items matching the search and the total in the table
    const pageCount = await Certificate.count({ where: whereclause });
    const allCount = await Certificate.count();

    // Send the final response
    res.status(200).json({
      List: certificateList,
      pageCount: pageCount,
      allCount: allCount,
    });
  } catch (err) {
    console.error('Error in certificate search:', err);
    res.status(500).json({ 
        message: "An error occurred during the search.",
        error: err.message 
    });
  }
};

// Delete certificate

exports.deleteCertificate = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const certId = req.params.certId;

    const certificate = await Certificate.findByPk(certId);
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found"
      });
    }

    await Certificate.destroy({
      where: { certId: certId },
      transaction: t
    });

    await t.commit();

    res.status(200).json({
      success: true,
      message: "Certificate deleted successfully"
    });

  } catch (err) {
    console.error('Error deleting certificate:', err);
    await t.rollback();
    
    res.status(500).json({
      success: false,
      message: "Error deleting certificate",
      error: err.message
    });
  }
};
