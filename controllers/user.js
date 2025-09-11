const { validationResult } = require("express-validator");
const { encode } = require("../middlewares/crypt");
const sequelize = require("../util/database");
const User = require("../models/user");
const { Op } = require("sequelize");

// Get a single user

/**@author Ganidu */
exports.getUser = async (req, res, next) => {
  const userName = req.params.userName;

  await User.findOne({
    where: { userName: userName },
  })
    .then((result) => {
      if (result.length == 0) {
        const error = new Error("Could not find Institute");
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

// Get all users 

/**@author Ganidu */
exports.getUsers = async (req, res, next) => {
  await User.findAll()
    .then((result) => {
      if (result.length == 0) {
        const error = new Error("Could not find User");
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

// Post

/**@author Ganidu */
exports.addUser = async (req, res, next) => {
  const t = await sequelize.transaction();
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, Entered data is incorrect");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const userName = req.body.userName;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    let userPW = req.body.userPW;
    const address = req.body.address;
    const contactNo = req.body.contactNo;
    const whatsAppNo = req.body.whatsAppNo;
    const email = req.body.email;
    const nicNo = req.body.nicNo;
    const createdBy = req.body.createdBy;
    const isActive = req.body.isActive;
    const userLevel = req.body.userLevel;
    const singUpCompanyName = req.body.singUpCompanyName;
    const profilePictureUrl = req.body.profilePictureUrl;

    console.log(userPW);

    const newData = await User.create(
      {
        userName: userName,
        firstName: firstName,
        lastName: lastName,
        address: address,
        userPW: await encode(userPW),
        contactNo: contactNo,
        whatsAppNo: whatsAppNo,
        email: email,
        nicNo: nicNo,
        createdBy: createdBy,
        isActive: isActive,
        userLevel: userLevel,
        singUpCompanyName: singUpCompanyName,
        profilePictureUrl: profilePictureUrl,
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

// Put

/**@author Ganidu */
exports.updateUser = async (req, res, next) => {
  const t = await sequelize.transaction();
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, Entered data is incorrect");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const userName = req.params.userName;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const address = req.body.address;
    const contactNo = req.body.contactNo;
    const whatsAppNo = req.body.whatsAppNo;
    const email = req.body.email;
    const nicNo = req.body.nicNo;
    const createdBy = req.body.createdBy;
    const isActive = req.body.isActive;
    const userLevel = req.body.userLevel;
    const singUpCompanyName = req.body.singUpCompanyName;
    const profilePictureUrl = req.body.profilePictureUrl;

    // Log the update in the audit trail
    const dataSet = await User.findByPk(userName); // Original data
    if (!dataSet) {
      return res.status(404).json({ message: "User not found" });
    }


    const updatedData = {
      userName: userName,
      firstName: firstName,
      lastName: lastName,
      address: address,
      contactNo: contactNo,
      whatsAppNo: whatsAppNo,
      email: email,
      nicNo: nicNo,
      createdBy: createdBy,
      isActive: isActive,
      userLevel: userLevel,
      singUpCompanyName: singUpCompanyName,
      profilePictureUrl: profilePictureUrl,
    };

    await User.update(
      {
        firstName: firstName,
        lastName: lastName,
        address: address,
        contactNo: contactNo,
        whatsAppNo: whatsAppNo,
        email: email,
        nicNo: nicNo,
        createdBy: createdBy,
        isActive: isActive,
        userLevel: userLevel,
        singUpCompanyName: singUpCompanyName,
        profilePictureUrl: profilePictureUrl,
      },
      { where: { userName: userName }, transaction: t }
    );

    await t.commit();

    // Log the creation in the audit trail
    await logAuditTrail(req, User, "UPDATE", "User", userName, "user", userName, null, null, null, updatedData, dataSet.dataValues, t);

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

// Search with pagination 

exports.UsersSearch = async (req, res, next) => {
  /**MAIN PARAMS */
  const pageNo = parseInt(req.params.pageNo);
  const numOfLine = parseInt(req.params.numOfLine);
  let searchText = req.params.searchText.toString().substring(0);

  /**CHECK PARAMEATERS EMPTY */
  if (searchText == "null") {
    res.status(200).json([]);
  } else {
    dynamicWhere = [];
    let wareclause = {};

    if (searchText !== "null") {
      searchText = searchText == "*" ? "" : searchText;
      dynamicWhere.push(
        { userName: { [Op.substring]: searchText } },
        //   { userPW: { [Op.substring]: searchText } },
        { firstName: { [Op.substring]: searchText } },
        { lastName: { [Op.substring]: searchText } },
        { address: { [Op.substring]: searchText } },
        { contactNo: { [Op.substring]: searchText } },
        { whatsAppNo: { [Op.substring]: searchText } },
        { email: { [Op.substring]: searchText } },
        { nicNo: { [Op.substring]: searchText } },
        { createdBy: { [Op.substring]: searchText } },
        { isActive: { [Op.substring]: searchText } },
        { userLevel: { [Op.substring]: searchText } },
        { singUpCompanyName: { [Op.substring]: searchText } },
        { profilePictureUrl: { [Op.substring]: searchText } }
      );
    }

    wareclause = { ...wareclause, [Op.or]: dynamicWhere };

    try {
      console.log("pageNo   :  " + pageNo);
      const userCount = await User.count();

      let prvPage = pageNo - 1;
      let prvPageline = prvPage * numOfLine;
      const userList = await User.findAll({
        order: [["createdAt", "ASC"]],
        where: wareclause,
        offset: prvPageline,
        limit: numOfLine,
      });

      const pageCount = await User.count({ where: wareclause });
      res.status(200).json({
        List: userList,
        pageCount: pageCount,
        allCount: userCount,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      if (err.original == null) {
        next(err);
      } else {
        next(err.original);
      }
    }
  }
};

// Get short user info 

exports.getUserShort = async (req, res, next) => {
  await User.findAll({
    attributes: ["nicNo", "firstName", "lastName"],
  })
    .then((result) => {
      if (result.length == 0) {
        const error = new Error("Could not find user institute");
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

// Delete user

/**@author Ganidu */
exports.deleteUser = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const userName = req.params.userName;

    // Find the original data
    const dataSet = await User.findOne({ where: { userName: userName } });
    if (!dataSet) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the record within a transaction
    await User.destroy({
      where: { userName: userName },
      transaction: t,
    });

    // Log the deletion in the audit trail (if applicable)
    await logAuditTrail(req, User, "DELETE", "User", userName, "user", userName, null, null, null, {}, dataSet.dataValues, t);

    // Commit the transaction
    await t.commit();

    res.status(200).json({ message: "Delete Success" });
  } catch (err) {
    // Rollback transaction on error
    await t.rollback();

    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err.original || err);
  }
};

// Set user inactive 
// @author Ganidu
exports.inactiveUser = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { userName } = req.params;

    const dataSet = await User.findByPk(userName); // Original data
    if (!dataSet) {
      return res.status(404).json({ message: "User not Found" });
    }

    // is Active UPDATE IN Student
    await User.update(
      {
        userName,
        isActive: "N",
      },
      { where: { userName }, transaction: t }
    );

    // Log the creation in the audit trail
    await logAuditTrail(req, User, "DELETE", "User", userName, "User", userName, null, null, null, {}, dataSet.dataValues, t);

    await t.commit();
    res.status(201).json({ message: "Inactive Success" });
  } catch (err) {
    console.error(err);
    const statusCode = err.statusCode || 500;
    await t.rollback();

    if (err.original == null) {
      next({ statusCode, message: err.message });
    } else {
      next(err.original);
    }
  }
};

// Paginated users with filter 

/**@author Ganidu */
exports.getUserPg = async (req, res, next) => {
  const isActive = req.params.isActive;
  const pageNo = parseInt(req.params.pageNo);
  const NumOfLine = parseInt(req.params.NumOfLine);
  const filter = req.params.filter.trim();

  let wareclause = {};

  // if attribute is an ENUM
  if (
    isActive &&
    isActive !== null &&
    isActive !== undefined &&
    isActive !== "null"
  ) {
    wareclause = { ...wareclause, isActive: isActive };
  }

  if (filter && filter !== "null") {
    wareclause = {
      ...wareclause,
      [Op.or]: [
        // Filter all model's attributes
        { userName: { [Op.substring]: filter } },
        { userPW: { [Op.substring]: filter } },
        { firstName: { [Op.substring]: filter } },
        { lastName: { [Op.substring]: filter } },
        { address: { [Op.substring]: filter } },
        { contactNo: { [Op.substring]: filter } },
        { whatsAppNo: { [Op.substring]: filter } },
        { email: { [Op.substring]: filter } },
        { nicNo: { [Op.substring]: filter } },
        { createdBy: { [Op.substring]: filter } },
        { isActive: { [Op.substring]: filter } },
        { userLevel: { [Op.substring]: filter } },
        { singUpCompanyName: { [Op.substring]: filter } },
        { profilePictureUrl: { [Op.substring]: filter } },
      ],
    };
  }

  if (isActive && isActive !== "null") {
    wareclause = { ...wareclause, isActive: isActive };
  }

  try {
    const Count = await User.count();

    let prvPage = pageNo - 1;
    let prvPageline = prvPage * NumOfLine;
    const List = await User.findAll({
      order: [["createdAt", "DESC"]], // ASC and DESC arohan awarohan piliwala

      where: wareclause,
      offset: prvPageline,
      limit: NumOfLine,
    });

    const filterCount = await User.count({ where: wareclause });

    res
      .status(200)
      .json({ List: List, allCount: Count, filterCount: filterCount });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    if (err.original == null) {
      next(err);
    } else {
      next(err.original);
    }
  }
};