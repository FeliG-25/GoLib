const express = require('express');
const adminController = require('./../controllers/adminController');
const router = express.Router();

router
.route('/book')
.post(adminController.addBook);

router
.route('/borrowApprove')
.get(adminController.getUnapprovedBorrowing);

router
.route('/returnApprove')
.get(adminController.getUnapprovedReturn);

router
.route('/transactions')
.get(adminController.getAllTransactionTest);

module.exports = router;