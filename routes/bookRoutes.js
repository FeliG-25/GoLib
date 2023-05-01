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
.route('/receive/:id_trans/:id_courier')
.put(auth(['MEMBER','ADMIN']),bookController.receivePacket);

module.exports = router;