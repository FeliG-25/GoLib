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

// Need auth
router
.route('/member/profile/:id')
.get(auth, userController.getUserProfile);
router
.route('/profile/:id')
.patch(userController.updateUserProfile);


module.exports = router;