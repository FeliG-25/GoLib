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
.get(auth, memberController.getUserCart)
.post(auth, memberController.addToCart);

router
.route('/transaction/:id')
.get(auth, memberController.getUserTransaction)
.patch(auth, memberController.returnBook);
router
.route('/checkout/:id')
.post(auth, memberController.checkOut);

module.exports = router;