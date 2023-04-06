const mongoose = require('mongoose');
const Book = require('./bookModel');

const transactionSchema = new mongoose.Schema({
    books: {
        type: [Book],
        required: [true, 'Transaction data must have name']
    },
    borrow_date: {
        type: Date,
        required: [true, 'Transaction data must have borrowing date']
    },
    deadline_date: {
        type: Date,
        required: [true, 'Transaction data must have deadline date']
    },
    returned_date: {
        type: Date
    },
    price: {
        type: Number,
        required: [true, 'Transaction must have price information']
    },
    fee: {
        type: Number
    }

});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;