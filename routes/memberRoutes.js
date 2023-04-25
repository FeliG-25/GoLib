const express = require('express');
const memberController = require('./../controllers/memberController');
const userController = require('./../controllers/userController');
const auth = require('../middleware/auth')
const router = express.Router();

// require auth

router
.route('/profile/:id')
.get(auth('MEMBER'), userController.getUserProfile)
router
.route('/cart/:id')
.get(auth('MEMBER'), memberController.getUserCart)
.post(auth('MEMBER'), memberController.addToCart);

router
.route('/transaction/:id')
.get(auth('MEMBER'), memberController.getUserTransaction)
.patch(auth('MEMBER'), memberController.returnBook);
router
.route('/checkout/:id')
.post(auth('MEMBER'), memberController.checkOut);

module.exports = router;