const express = require('express');
const bookController = require('./../controllers/bookController');
const auth = require('../middleware/auth')
const router = express.Router();

// without params
router
.route('/')
.get(bookController.getAllBooks);

// with params
router
.route('/:id')
.get(bookController.getBook);

router
.route('/receive/:id')
.put(bookController.receivePacket);

module.exports = router;