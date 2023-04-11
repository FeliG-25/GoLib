const mongoose = require('mongoose');
const Borrowed = require('./transactionModel');
const Courier = require('./courierModel');

const borrowSchema = new mongoose.Schema({
    borrows: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    }],
    couriers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courier'
    }]
});

const Borrow = mongoose.model('Borrow', borrowSchema);

module.exports = Borrow;