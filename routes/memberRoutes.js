const express = require('express');
const memberController = require('./../controllers/memberController');
const userController = require('./../controllers/userController');
const auth = require('../middleware/auth')
const router = express.Router();

// require auth
router
.route('/profile/:id')
.get(auth('MEMBER'), userController.getUserProfile) //View Profile
.patch(auth('MEMBER'), userController.updateUserProfile) //Edit Profile

router
.route('/password/:id')
.patch(auth('MEMBER'), userController.updateUserPassword) //Edit Password

router
.route('/cart/:id')
.get(auth('MEMBER'), memberController.getUserCart) //Get user Cart
.post(auth('MEMBER'), memberController.addToCart) //Add book to cart

router
.route('/transactions/:id')
.get(auth('MEMBER'), memberController.getUserTransaction) //Get member transactions

router
.route('/transactions/return/:id')
.patch(auth('MEMBER'), memberController.returnBook); //Return a book

router
.route('/checkout/:id')
.post(auth('MEMBER'), memberController.checkOut); //Checkout from a cart

module.exports = router;