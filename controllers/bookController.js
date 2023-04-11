const Book = require('./../models/bookModel');

exports.getAllBooks = async (req, res) => {
    try{
        const books = await Book.find();

        res.status(201).json({
            status: 'success',
            results: books.length,
            data: {
                books
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent!'
        })
    }
}