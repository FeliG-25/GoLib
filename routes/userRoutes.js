const express = require('express');
const userController = require('./../controllers/userController');
const router = express.Router();

// Register new User
router
.route('/register')
.post(userController.createUser);

// Login
router
.route('/login')
.post(userController.login);


module.exports = router;