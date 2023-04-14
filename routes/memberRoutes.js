const express = require('express');
const memberController = require('./../controllers/memberController');
const auth = require('../middleware/auth')
const router = express.Router();

// require auth
router
.route('/cart/:id')
.get(auth, memberController.getUserCart);
router
.route('/transaction/:id')
.get(auth, memberController.getUserTransaction);

module.exports = router;