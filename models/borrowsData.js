const mongoose = require('mongoose');
const Borrowed = require('./transactionModel');
const Courier = require('./courierModel');

const borrowSchema = new mongoose.Schema({
    borrows: {
        type: [Borrowed]
    },
    couriers: {
        type: [Courier]
    }
});

const Borrow = mongoose.model('Borrow', borrowSchema);

module.exports = Borrow;