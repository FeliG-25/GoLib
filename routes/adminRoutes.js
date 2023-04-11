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
.route('/:id')
.put(adminController.topUpUserBalance)

router
.route('/choose-courier/:id')
.put(adminController.changeBorrowingState)
//ini masih buat sementara dulu <buat testing aja data yang di get apa aja>
router
.route('/transactions')
.get(adminController.getAllTransactionTest);

router
.route('/incomeTest')
.get(adminController.getIncomeTest);

// router
// .route('/topUpTest')
// .get(adminController.getMemberTest);

module.exports = router;