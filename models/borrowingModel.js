const mongoose = require('mongoose');
const Book = require('./bookModel');

const borrowingSchema = new mongoose.Schema({
    books: {
        type: [Book],
        required: [true, 'Borrowing data must have name']
    },
    borrow_date: {
        type: Date,
        required: [true, 'Borrowing data must have borrowing date']
    },
    deadline_date: {
        type: Date,
        required: [true, 'Borrowing data must have deadline date']
    },
    returned_date: {
        type: Date
    },
    price: {
        type: Number,
        required: [true, 'Borrowing must have price information']
    },
    fee: {
        type: Number
    }

});

const Borrowing = mongoose.model('Borrowing', borrowingSchema);

module.exports = Borrowing;