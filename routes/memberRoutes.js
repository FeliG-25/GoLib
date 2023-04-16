const express = require('express');
const memberController = require('./../controllers/memberController');
const userController = require('./../controllers/userController');
const auth = require('../middleware/auth')
const router = express.Router();

// require auth

router
.route('/profile/:id')
.get(auth, userController.getUserProfile)
router
.route('/cart/:id')
.get(auth, memberController.getUserCart);
router
.route('/transaction/:id')
.get(auth, memberController.getUserTransaction)
.patch(auth, memberController.returnBook);

module.exports = router;