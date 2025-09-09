const express = require('express');
const { body } = require('express-validator');
//const isAuth = require('../middlewares/is-auth');

const userController = require('../controllers/user');

const router = express.Router();

// GET
router.get('/user/:userName', userController.getUser);
router.get('/users', userController.getUsers);
router.get('/user_pg/:isActive/:filter/:NumOfLine/:pageNo', userController.getUserPg);
router.get('/user_sh/:searchText/:numOfLine/:pageNo', userController.UsersSearch);
router.get("/user_short", userController.getUserShort);


// POST
router.post('/user', userController.addUser);

// PUT
router.put('/user/:userName', userController.updateUser);

// DELETE
router.delete('/user/:userName', userController.deleteUser);

module.exports = router;
