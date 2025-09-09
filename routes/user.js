const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middlewares/is-auth');

const userController = require('../controllers/user');

const router = express.Router();

// GET
router.get('/user/:userName', isAuth, userController.getUser);
router.get('/users', isAuth, userController.getUsers);
router.get('/user_pg/:isActive/:filter/:NumOfLine/:pageNo', isAuth, userController.getUserPg);
router.get('/user_sh/:searchText/:numOfLine/:pageNo', isAuth, userController.UsersSearch);
router.get("/user_short", isAuth, userController.getUserShort);


// POST
router.post('/user', isAuth, userController.addUser);

// PUT
router.put('/user/:userName', isAuth, userController.updateUser);

// DELETE
router.delete('/user/:userName', isAuth, userController.deleteUser);

module.exports = router;
