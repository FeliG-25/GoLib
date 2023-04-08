const mongoose = require('mongoose');
const Book = require('./bookModel');

const cartSchema = new mongoose.Schema({
    books: {
        type: [Book.schema]
    }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;