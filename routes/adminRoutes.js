const express = require('express');
const adminController = require('./../controllers/adminController');
const router = express.Router();

router
.route('/book')
.post(adminController.addBook);

module.exports = router;