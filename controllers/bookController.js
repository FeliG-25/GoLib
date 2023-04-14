const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')

const Book = require('./../models/bookModel');

const mongoose = require('mongoose')

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

exports.getBook = async (req, res) => {
    try{
        const book = await Book.findById(req.params.id);

        res.status(201).json({
            status: 'success',
            data: {
                book
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}