const Transaction = require('../models/transactionModel');
const Book = require('./../models/bookModel');
const Courier = require('./../models/courierModel')
const MonthIncome = require('./../models/monthIncome')
const Member = require('./../models/memberModel')

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
    const { admin_branch } = req.body
    try {
        const borrowsData = await Transaction.find({status: 'borrow_process'}, 'borrow_date books');
        const courierData = await Courier.find({courier_status: 'available'}, 'courier_name')
        
        res.status(201).json({
            status: 'success',
            results: borrowsData.length,
            data: {
                borrow: borrowsData,
                courier: courierData
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
    const { admin_branch } = req.body
    try {
        const returnedData = await Transaction.find({status: 'return_process'}, 'returned_date books');
        const courierData = await Courier.find({courier_status: 'available'}, 'courier_name')

        res.status(201).json({
            status: 'success',
            results: returnedData.length,
            data: {
                borrow: returnedData,
                courier: courierData
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent!'
        })
    }
}

exports.changeBorrowingState = async (req,res) => {
    const { state_type, courier_id, stock_id, transaction_id, delivery_fee } = req.body
    try {
        const stockIds = stock_id.split(",")
        await Transaction.updateOne(req.params.id, {$inc: { price: parseInt(delivery_fee)}}, {new: true});
        for (let i = 0; i < stockIds.length; i++) {
            const result = await Transaction.updateOne(req.params.id, {status: state_type});

            if (result.nModified !== 0) {
                if (state_type === "returned") {
                    await Book.updateOne({_id: stockIds[i]}, {$inc: {stock: 1}});
                }
                count += result.nModified;
            }

            if (count === stockIds.length) {
                
            }
        }
        
    } catch {

    }
}

exports.getIncome = async (req, res) => {
    try {
        const incomes = await MonthIncome.aggregate([
            {
                $match: {
                    'books.branchId': branch_id
                }
            },
            {
                $lookup: {
                    from: 'transaction',
                    localField: 'transaction._id',
                    foreignField: 'transaction._id',
                    as: 'transaction'
                }
            },
            {
                $lookup: {
                  from: 'books',
                  localField: 'borrowslist.books._id',
                  foreignField: 'books._id',
                  as: 'stocks'
                }
            },
            {
                $group: {
                  _id: {
                    borrowId: '$transaction._id',
                    branchId: '$books.branch_id',
                    month: { $month: '$transaction.borrow_date' }
                  },
                  MonthName: { $first: { $monthName: '$transaction.borrow_date' } },
                  SumBorrows: { $sum: '$transaction._id' },
                  Income: { $sum: '$transaction.price' }
                }
            },
            {
                $sort: {
                  '_id.month': 1,
                  '_id.branchId': 1
                }
            }
        ])
    } catch {

    }
}

exports.topUpUserBalance = async (req, res) => {
    const {user_id, top_up_value} = req.body
    try {
        await Member.updateOne({_id: user_id}, {$inc: { balance: parseInt(top_up_value)}}, {new: true});
    } catch {

    }
}

exports.getAllTransactionTest = async (req, res) => {
    try {
        const transaction = await Transaction.find({}).populate('books')
        res.status(201).json({
            status: 'success',
            results: transaction.length,
            data: {
                transactions: transaction
            }
        })
    } catch {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent!'
        })
    }
}