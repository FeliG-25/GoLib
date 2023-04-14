const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')

const User = require('./../models/userModel')
const Member = require('./../models/memberModel')
const Cart = require('./../models/cartModel')
const Transaction = require('./../models/transactionModel')

const mongoose = require('mongoose')

dotenv.config({path: './config.env'});

exports.getUserCart = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const member = await Member.findOne({'member_id':user._id})
        const cart = await Cart.find({'_id':member.cart});
        
        res.status(200).json({
            status: '200',
            message: 'Success!',
            data: cart
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
}

exports.getUserTransaction = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const member = await Member.findOne({'member_id':user._id});
        const transaction = await Transaction.find({'_id':member.transactions});
        
        res.status(200).json({
            status: '200',
            message: 'Success!',
            data: transaction
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
}

exports.returnBook = async (req, res) => {
    try {
        
        res.status(200).json({
            status: '200',
            message: 'Success!'
            // data: transactions
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
}