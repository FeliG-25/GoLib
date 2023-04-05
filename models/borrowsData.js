const mongoose = require('mongoose');
const Borrowing = require('./borrowingModel');
const Courier = require('./courierModel');

const borrowSchema = new mongoose.Schema({
    borrows: {
        type: [Borrowing]
    },
    couriers: {
        type: [Courier]
    }
});

const Borrow = mongoose.model('Borrow', borrowSchema);

module.exports = Borrow;