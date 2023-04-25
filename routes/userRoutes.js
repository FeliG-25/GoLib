const express = require('express');
const userController = require('./../controllers/userController');
const auth = require('../middleware/auth')
const router = express.Router();

// Register new User
router
.route('/register')
.post(userController.createUser);

// Login
router
.route('/login')
.post(userController.login);

//Logout
router
.route('/logout')
.post(userController.logout);

// Need auth
router
.route('/profile/:id')
.get(auth('MEMBER'), userController.getUserProfile)

router
.route('/member/password/edit/:id')
.patch(auth('MEMBER'), userController.updateUserPassword);

router
.route('/member/profile/edit/:id')
.patch(auth('MEMBER'), userController.updateUserProfile);

module.exports = router;