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
.route('/profile/:id')
.get(auth, userController.getUserProfile)

router
.route('/member/password/edit/:id')
.patch(auth, userController.updateUserPassword);

router
.route('/member/profile/edit/:id')
.patch(auth, userController.updateUserProfile);



module.exports = router;