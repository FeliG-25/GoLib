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

        res.status(302).json({
            status: 302,
            results: books.length,
            data: {
                books
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
}

exports.getBook = async (req, res) => {
    try{
        const book = await Book.findById(req.params.id);

        res.status(302).json({
            status: 302,
            data: {
                book
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
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
                res.status(404).json({
                    status: 'fail',
                    message: 'Transaction data was wrong!'
                })
            }
        } else {
            res.status(409).json({
                status: 'fail',
                message: 'Packet already received!'
            })
        }
        
    } catch {
        console.error(err.message);
        res.status(500).send('server error');
    }
}