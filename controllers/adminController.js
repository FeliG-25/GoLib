const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const credentials = require('../credential.json');
const Transaction = require('../models/transactionModel');
const Book = require('./../models/bookModel');
const Borrow = require('./../models/borrowsData');
const Courier = require('./../models/courierModel')
const MonthIncome = require('./../models/monthIncome')
const Member = require('./../models/memberModel')
const Admin = require('../models/adminModel')
const mongoose = require('mongoose');

exports.addBook = async (req,res) => {
    try {
        const book = await Book.find({title: req.body.title, author: req.body.author});
        if (book.length != 0) {
            //asumsinya untuk judul dan author itu cuma ada 1..
            res.status(400).json({
                status: 'failed to add new book',
                message: "Book already exists!"
            })
        } else {
            const auth = new google.auth.GoogleAuth({
                credentials: credentials,
                scopes: ['https://www.googleapis.com/auth/drive.file'],
            });
            
            const drive = google.drive({ version: 'v3', auth });
    
            const fileName = path.basename(req.body.cover_path)
            const mimeType = mime.getType(req.body.cover_path)
    
            if (!fileName || !mimeType) {
                throw new Error('Gagal mendapatkan nama file atau tipe MIME');
            }
    
            const fileMetadata = {
                name: fileName,
                mimeType: mimeType,
                parents: ['1TGmjhNF5Ud-8t8nz5Lw-7VbHssFY7lfS']
            };
            const media = {
                mimeType: mimeType,
                body: fs.createReadStream(req.body.cover_path)
            };
            const uploadedFile = await drive.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id'
            });
            req.body.cover_path = uploadedFile.data.id.toString();
    
            const newBook = await Book.create(req.body)
            res.status(201).json({
                status: 'success add new book',
                data: {
                    book: newBook
                }
            })
        }
        
    } catch (err) {
        res.status(400).json({
            status: 'failed to add new book',
            message: "Invalid data sent!\n" + err
        })
    }
}

exports.getUnapprovedBorrowing = async (req,res) => {
    try {
        const user_admin = JSON.parse(req.cookies.user)
        const admin_data = await Admin.findOne({admin_id:mongoose.Types.ObjectId(user_admin._id)})
        const borrowsData = await Transaction.find({status: 'borrow_process'}, 'borrow_date');
        if (borrowsData.length > 0) {
            const courierData = await Courier.find({courier_status: 'available', branch_id: admin_data.branch}, 'courier_name')
            res.status(201).json({
                status: 'success',
                results: borrowsData.length,
                data: {
                    borrow: borrowsData,
                    courier: courierData
                }
            })
        } else {
            res.status(400).json({
                status: 'fail',
                message: 'No transactions found in borrow_process status!'
            })
        }
        
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent!'
        })
    }
}

exports.getUnapprovedReturn = async (req,res) => {
    try {
        const user_admin = JSON.parse(req.cookies.user)
        const admin_data = await Admin.findOne({admin_id:mongoose.Types.ObjectId(user_admin._id)})
        const returnedData = await Transaction.find({status: 'return_process'}, 'returned_date books');
        if (returnedData.length > 0) {
            const courierData = await Courier.find({courier_status: 'available', branch_id: admin_data.branch}, 'courier_name')
            res.status(201).json({
                status: 'success',
                results: returnedData.length,
                data: {
                    borrow: returnedData,
                    courier: courierData
                }
            })
        } else {
            res.status(400).json({
                status: 'fail',
                message: 'No transactions found in return_process status!'
            })
        }
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent!' + err
        })
    }
}

exports.changeBorrowingState = async (req,res) => {
    const { state_type, courier_id, delivery_fee } = req.body
    try {
        const transactionData = await Transaction.findById(mongoose.Types.ObjectId(req.params.id)).populate('books')
        const courierData = await Courier.findById(mongoose.Types.ObjectId(courier_id))
        
        if (transactionData && courierData) {
            //update books stocks
            for (var i = 0; i < transactionData.books.length; i++) {
                if (state_type === "returned") {
                    await Book.updateOne(transactionData.books[i],{$inc: {stock: 1}})
                } else if (state_type === "borrowed") {
                    await Book.updateOne(transactionData.books[i],{$inc: {stock: -1}})
                }
            }

            if (state_type === "returned") {
                //update courier status
                await Courier.updateOne({"_id":mongoose.Types.ObjectId(courier_id)},{courier_status: "unavailable"})
                //update transaction
                transactionData.price += Number(delivery_fee)
                transactionData.status = state_type
                const temp_over_due_date = Math.floor((transactionData.returned_date - transactionData.deadline_date)/(1000*60*70*24))
                if (temp_over_due_date > 0) {
                    transactionData.fee = temp_over_due_date * 10000
                }
                await transactionData.save()
                //update member balance
                const member = await Member.findOne({transactions: mongoose.Types.ObjectId(req.params.id)}).populate('transactions')
                member.balance -= (transactionData.fee + Number(delivery_fee))
                await member.save()
            } else {
                await Courier.updateOne({"_id":mongoose.Types.ObjectId(courier_id)},{courier_status: "unavailable"})
                //update transaction
                transactionData.price += Number(delivery_fee)
                transactionData.status = state_type
                await transactionData.save()
                //update member balance
                const member = await Member.findOne({transactions: mongoose.Types.ObjectId(req.params.id)}).populate('transactions')
                console.log(member)
                member.balance -= Number(delivery_fee)
                await member.save()
            }
            //get updated transaction
            const borrow = await Borrow.create({'transaction_id':mongoose.Types.ObjectId(req.params.id),'courier_id':mongoose.Types.ObjectId(courier_id),'status':'on_the_way'})
            
            res.status(201).json({
                status: 'success',
                data: borrow
            })
        } else {
            res.status(400).json({
                status: 'fail',
                message: 'Something wrong with transaction or courier id!'
            })
        }
        
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Update Failed!' + err
        })
    }
}

exports.topUpUserBalance = async (req, res) => {
    try {
        const member_old = await Member.findOne({member_id:mongoose.Types.ObjectId(req.params.id)}, 'balance')
        if (member_old) {
            const member_new = await Member.findOneAndUpdate({member_id: mongoose.Types.ObjectId(req.params.id)},{$inc:{balance: Number(req.body.top_up_value)}},{new:true, projection: {balance:1}})

            res.status(200).json({
                status: 'success',
                data: {
                    old_data: member_old,
                    updated_data: member_new
                }
            })
        } else {
            res.status(400).json({
                status: 'fail',
                message: 'Member not found!'
            })
        }
        
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Update error!!\n' + err.message
        })
    }
}

exports.getIncome = async (req, res) => {
    try {
        const monthTransactions = await await Transaction.find({}, 'price fee borrow_date')
        var monthIncomes = new Array(12)
        for (var i = 0; i < 12; i++) {
            monthIncomes[i] = new MonthIncome({
                month_name: new Date(0, (i)).toLocaleString('default', { month: 'long' }),
                sum_borrows: 0,
                month_incomes: 0
            })
        }

        for(var i = 0; i < monthTransactions.length; i++) {
            var temp = monthTransactions[i].borrow_date.getMonth()
            monthIncomes[temp].sum_borrows += 1
            monthIncomes[temp].sum_borrows += monthTransactions[i].price + monthTransactions[i].fee
        }

        res.status(200).json({
            status: 'success',
            data: {
                month_income: monthIncomes
            }
        })
    } catch {
        res.status(400).json({
            status: 'fail',
            message: 'Update error!!\n' + err.message
        })
    }
}