const Transaction = require('../models/transactionModel');
const Book = require('./../models/bookModel');
const Transaction = require('./../models/transactionModel')

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

exports.getUnapprovedBorrowing = async (req,res) => {
    try {
        const borrowsData = await Transaction.find({branch: '', status: ''},);

        res.status(201).json({
            status: 'success',
            results: borrowsData.length,
            data: {
                tours: borrowsData
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent!'
        })
    }
}

exports.getUnapprovedReturn = async (req,res) => {
    try {
        const borrowsData = await Transaction.find({branch: '', status: ''},);

        res.status(201).json({
            status: 'success',
            results: borrowsData.length,
            data: {
                tours: borrowsData
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent!'
        })
    }
}