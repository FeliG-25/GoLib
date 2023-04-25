const mongoose = require('mongoose');
const Borrowed = require('./transactionModel');
const Courier = require('./courierModel');

const borrowSchema = new mongoose.Schema({
    transaction_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    },
    courier_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courier'
    },
    status: {
        type: String
    }
});

const Borrow = mongoose.model('Borrow', borrowSchema);

module.exports = Borrow;