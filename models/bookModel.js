const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Book must have a title']
    },
    cover_path: {
        type: String,
        required: [true, 'Book must have a cover']
    },
    author: {
        type: String,
        required: [true, 'Book must have an author']
    },
    genre: {
        type: String,
        required: [true, 'Book must have a genre']
    },
    year: {
        type: Number,
        required: [true, 'Book must have specific year']
    },
    page: {
        type: Number
    },
    rent_price: {
        type: Number,
        required: [true, 'Book must have rent price']
    },
    stock: {
        type: Number,
        required: [true, 'Book must have specific stock']
    },
    branch_name: {
        type: String,
        required: [true, 'Book must in spesific branch']
    }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;