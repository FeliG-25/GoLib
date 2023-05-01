const express = require('express');
const adminController = require('./../controllers/adminController');
const auth = require('../middleware/auth')
const router = express.Router();

router
.route('/add-book')
.post(auth('ADMIN'), adminController.addBook);

router
.route('/borrow-approve')
.get(auth('ADMIN'), adminController.getUnapprovedBorrowing);

router
.route('/return-approve')
.get(auth('ADMIN'), adminController.getUnapprovedReturn);

router
.route('/topup/:id')
.put(auth('ADMIN'), adminController.topUpUserBalance)

router
.route('/income')
.get(auth('ADMIN'), adminController.getIncome)

router
.route('/choose-courier/:id')
.put(auth('ADMIN'), adminController.changeBorrowingState)

module.exports = router;