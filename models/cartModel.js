const mongoose = require('mongoose');
const Book = require('./bookModel');

const cartSchema = new mongoose.Schema({
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }]
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;