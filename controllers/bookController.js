const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')

const Book = require('./../models/bookModel');
const Courier = require('./../models/courierModel')

const mongoose = require('mongoose');
const Borrow = require('../models/borrowsData');
const Transaction = require('../models/transactionModel');

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

exports.receivePacket = async (req, res) => {
    try {
        const borrowData = await Borrow.findOne({transaction_id:mongoose.Types.ObjectId(req.params.id_trans),courier_id:mongoose.Types.ObjectId(req.params.id_courier),status:'on_the_way'})
        if (borrowData) {
            const transactionData = await Transaction.findById(mongoose.Types.ObjectId(req.params.id_trans),"status")
            const user = JSON.parse(req.cookies.user)
            if ((user.user_type === 'MEMBER' && transactionData.status === "borrowed") || (user.user_type === 'ADMIN' && transactionData.status === 'returned')) {
                await Courier.updateOne({_id: mongoose.Types.ObjectId(req.params.id_courier)},{courier_status: "available"})
                await Borrow.updateOne({transaction_id:mongoose.Types.ObjectId(req.params.id_trans),courier_id:mongoose.Types.ObjectId(req.params.id_courier),status:'on_the_way'},{status:'received'})
                res.status(200).json({
                    status: 'success',
                    message: 'Packet received'
                })
            } else {
                res.status(400).json({
                    status: 'fail',
                    message: 'Transaction data was wrong!'
                })
            }
        } else {
            res.status(400).json({
                status: 'fail',
                message: 'Packet already received!'
            })
        }
        
    } catch {
        res.status(400).json({
            status: 'fail',
            message: 'Receive packet can\'t be process'
        })
    }
}