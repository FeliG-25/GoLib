const Transaction = require('../models/transactionModel');
const Book = require('./../models/bookModel');

exports.addBook = async (req,res) => {
    try {
        const newBook = await Book.create(req.body)
        res.status(201).json({
            status: 'success add new book',
            data: {
                book: newBook
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'failed to add new book',
            message: "Invalid data sent!\n" + err
        })
    }
}