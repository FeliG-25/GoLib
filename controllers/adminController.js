const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const credentials = require('../credential.json');
const Transaction = require('../models/transactionModel');
const Book = require('./../models/bookModel');
const Courier = require('./../models/courierModel')
const MonthIncome = require('./../models/monthIncome')
const Member = require('./../models/memberModel')
const mongoose = require('mongoose');

exports.addBook = async (req,res) => {
    try {
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
    } catch (err) {
        res.status(400).json({
            status: 'failed to add new book',
            message: "Invalid data sent!\n" + err
        })
    }
}

exports.getUnapprovedBorrowing = async (req,res) => {
    const { admin_branch } = req.body //<- ini buat cek branch kurir tapi nanti deh 
    try {
        const borrowsData = await Transaction.find({status: 'borrow_process'}, 'borrow_date');
        const courierData = await Courier.find({courier_status: 'available', branch_id: mongoose.Types.ObjectId(admin_branch)}, 'courier_name')

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
    const { admin_branch } = req.body //<- ini buat cek branch kurir tapi nanti deh 
    try {
        const returnedData = await Transaction.find({status: 'return_process'}, 'returned_date books');
        const courierData = await Courier.find({courier_status: 'available', branch_id: mongoose.Types.ObjectId(admin_branch)}, 'courier_name')

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
            message: 'Invalid data sent!' + err
        })
    }
}

exports.changeBorrowingState = async (req,res) => {
    const { state_type, courier_id, delivery_fee } = req.body
    try {
        const transactionData = await Transaction.findById(mongoose.Types.ObjectId(req.params.id)).populate('books')
        // await Transaction.updateOne(req.params.id, {$inc: { price: parseInt(delivery_fee)}}, {new: true});
        for (var i = 0; i < transactionData.books.length; i++) {
            // const result = await Transaction.updateOne(req.params.id, {status: state_type});
            
            if (state_type === "returned") {
                await Book.updateOne(transactionData.books[i],{$inc: {stock: 1}})
            } 
        }
        await Courier.updateOne({"_id":mongoose.Types.ObjectId(courier_id)},{courier_status: "available"})
        transactionData.price += Number(delivery_fee)
        transactionData.status = state_type
        const temp_over_due_date = Math.floor((transactionData.returned_date - transactionData.deadline_date)/(1000*60*70*24))
        if (temp_over_due_date > 0) {
            transactionData.fee = temp_over_due_date * 10000
        }
        await transactionData.save()
        //potong saldo user
        const updated_trans = await Transaction.findById(mongoose.Types.ObjectId(req.params.id)).populate('books')
        res.status(201).json({
            status: 'success',
            data: updated_trans
        })
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
        const member_new = await Member.findOneAndUpdate({member_id: mongoose.Types.ObjectId(req.params.id)},{$inc:{balance: Number(req.body.top_up_value)}},{new:true, projection: {balance:1}})

        res.status(200).json({
            status: 'success',
            data: {
                old_data: member_old,
                updated_data: member_new
            }
        })
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