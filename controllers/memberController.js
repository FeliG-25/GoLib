const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')

const User = require('./../models/userModel')
const Member = require('./../models/memberModel')
const Book = require('./../models/bookModel')
const Cart = require('./../models/cartModel')
const Transaction = require('./../models/transactionModel')
const userController = require('./userController')
const ActiveUser = require('./../models/activeUser')

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

exports.checkOut = async (req, res) => {
    try {
        let totalPrice = 0
        let date = new Date().toISOString().split('T')[0]
        let deadline = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        const cart = await Cart.findById(req.params.id)
        const activeUserId = ActiveUser.getActiveUser()
        const activeMember = await Member.find({member_id: activeUserId})

        const bookIds = cart.books

        const books = await Book.find({
            _id: {
                $in: bookIds
            }
        }).exec()

        if(books.length == 0){
            res.status(400).json({
                status: '400',
                message: 'Cart is empty! Please choose books.'
            });
    
        } else {
            books.forEach((book) => {
                console.log(book.rent_price)
                totalPrice += book.rent_price
            })

            console.log("Total: "+totalPrice)

            const newTransaction = new Transaction ({
                books: bookIds, 
                borrow_date: date, 
                deadline_date: deadline,
                returned_date: null,
                price: totalPrice,
                fee:0,
                status: 'borrow_process'
            })

            await newTransaction.save().then(newTransaction => {
                cart.books = []
                cart.save()
                activeMember[0].transactions.push(newTransaction._id)
                activeMember[0].save()
            })
            
            res.status(200).json({
                status: '200',
                message: 'Success!',
                data: cart
            });
        }

    }catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
}

exports.getUserTransaction = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const member = await Member.findOne({'member_id':user._id})
        const transaction = await Transaction.find({'_id':member.transactions})
        
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
        // Check if miss click transaction that has been returned
        const selectedTransaction = await Transaction.findById(req.params.id)
        if (selectedTransaction.status != 'borrowed') {
            return res.status(400).json({
                status: 'fail',
                message: 'Books had been returned or in process of being borrowed'
            });
        }

        const date = JSON.stringify(new Date().toJSON());

        const updateTransaction = await Transaction.updateOne(
            { _id: selectedTransaction._id },
            { $set:
                {
                    status: 'return_process',
                    returned_date: date.substring(0, 10)
                }
            }
        )

        let result = {
            _id: selectedTransaction._id,
            status_message: 'Waiting for return approval'
        }

        res.status(200).json({
            status: '200',
            message: 'Success!',
            data: result
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
}