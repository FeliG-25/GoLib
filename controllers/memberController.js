const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')

const Member = require('./../models/memberModel')

const mongoose = require('mongoose')

dotenv.config({path: './config.env'});

exports.getUserCart = async (req, res) => {
    try {
        const cart = await Member.findById(req.params.id).select("cart")
        
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
        const transactions = await Member.findById(req.params.id).select("transactions")
        
        res.status(200).json({
            status: '200',
            message: 'Success!',
            data: transactions
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
}