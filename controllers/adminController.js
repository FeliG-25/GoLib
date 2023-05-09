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
            res.status(409).json({
                status: 409,
                message: "Book already exists!"
            })
        } else {
            //autentikasi untuk akses ke drive
            const auth = new google.auth.GoogleAuth({
                credentials: credentials,
                scopes: ['https://www.googleapis.com/auth/drive.file'],
            });
            
            const drive = google.drive({ version: 'v3', auth });
            
            //data image yang diperlukan untuk upload ke drive
            const fileName = path.basename(req.body.cover_path)
            const mimeType = mime.getType(req.body.cover_path)
    
            if (!fileName || !mimeType) {
                res.status(400).json({
                    status: 400,
                    message: "Something wrong with cover_path"
                })
            } else {
                //upload image ke drive
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

                //biar yang disimpen di mongo si id imagenya aja
                req.body.cover_path = uploadedFile.data.id.toString();
                
                //create buku ke mongodb
                const newBook = await Book.create(req.body)

                res.status(201).json({
                    status: 201,
                    data: {
                        book: newBook
                    }
                })
            }
        }
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
}

exports.getUnapprovedBorrowing = async (req,res) => {
    try {
        const borrowsData = await Transaction.find({status: 'borrow_process'}, 'borrow_date books');
        if (borrowsData.length > 0) {
            const courierData = await Courier.find({courier_status: 'available'}, 'courier_name')
            if (courierData.length > 0) {
                res.status(302).json({
                    status: 302,
                    results: borrowsData.length,
                    data: {
                        borrow: borrowsData,
                        courier: courierData
                    }
                })
            } else {
                res.status(404).json({
                    status: 404,
                    message: 'Available courier not found!'
                })
            }
        } else {
            res.status(404).json({
                status: 404,
                message: 'No transactions found in borrow_process status!'
            })
        }
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
}

exports.getUnapprovedReturn = async (req,res) => {
    try {
        const returnedData = await Transaction.find({status: 'return_process'}, 'returned_date books');
        if (returnedData.length > 0) {
            const courierData = await Courier.find({courier_status: 'available'}, 'courier_name')
            if (courierData.length > 0) {
                res.status(302).json({
                    status: 302,
                    results: returnedData.length,
                    data: {
                        borrow: returnedData,
                        courier: courierData
                    }
                })
            } else {
                res.status(404).json({
                    status: 404,
                    message: 'Available courier not found!'
                })
            }
            
        } else {
            res.status(404).json({
                status: 404,
                message: 'No transactions found in return_process status!'
            })
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
}

exports.changeBorrowingState = async (req,res) => {
    const { state_type, courier_id, delivery_fee } = req.body
    try {
        const transactionData = await Transaction.findById(mongoose.Types.ObjectId(req.params.id)).populate('books')
        const courierData = await Courier.findById(mongoose.Types.ObjectId(courier_id))
        
        if (transactionData && courierData) {
            if ((state_type === "returned" && transactionData.status === "return_process") || (state_type === "borrowed" && transactionData.status === "borrow_process")) {
                //update books stocks
                for (var i = 0; i < transactionData.books.length; i++) {
                    if (state_type === "returned") {
                        await Book.updateOne({"_id": mongoose.Types.ObjectId(transactionData.books[i]._id)},{$inc: {stock: 1}})
                    } else if (state_type === "borrowed") {
                        await Book.updateOne({"_id": mongoose.Types.ObjectId(transactionData.books[i]._id)},{$inc: {stock: -1}})
                    }
                }
                
                //update courier status
                await Courier.updateOne({"_id":mongoose.Types.ObjectId(courier_id)},{courier_status: "unavailable"})
                
                //update transaction
                transactionData.price += Number(delivery_fee)
                transactionData.status = state_type
                if (state_type === "returned") {
                    const temp_over_due_date = Math.floor((transactionData.returned_date - transactionData.deadline_date)/(1000*60*70*24))
                    if (temp_over_due_date > 0) {
                        transactionData.fee = temp_over_due_date * 10000
                    }
                }
                await transactionData.save()

                //update member balance
                const member = await Member.findOne({transactions: mongoose.Types.ObjectId(req.params.id)}).populate('transactions')
                if (state_type === "returned") {
                    member.balance -= (transactionData.fee + Number(delivery_fee))
                } else {
                    member.balance -= transactionData.price
                }
                await member.save()

                //add tracking
                const borrow = await Borrow.create({'transaction_id':mongoose.Types.ObjectId(req.params.id),'courier_id':mongoose.Types.ObjectId(courier_id),'status':'on_the_way'})
                
                res.status(201).json({
                    status: 201,
                    data: borrow
                })
            } else {
                res.status(400).json({
                    status: 400,
                    message: 'Something wrong with transaction status'
                })
            }
        } else {
            res.status(404).json({
                status: 404,
                message: 'Something wrong with transaction or courier id!'
            })
        }
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
}

exports.topUpUserBalance = async (req, res) => {
    try {
        const member_old = await Member.findOne({member_id:mongoose.Types.ObjectId(req.params.id)}, 'balance')
        if (member_old) {
            const member_new = await Member.findOneAndUpdate({member_id: mongoose.Types.ObjectId(req.params.id)},{$inc:{balance: Number(req.body.top_up_value)}},{new:true, projection: {balance:1}})

            res.status(200).json({
                status: 200,
                data: {
                    old_data: member_old,
                    updated_data: member_new
                }
            })
        } else {
            res.status(404).json({
                status: 404,
                message: 'Member not found!'
            })
        }
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
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

        res.status(302).json({
            status: 302,
            data: {
                month_income: monthIncomes
            }
        })
    } catch {
        console.error(err.message);
        res.status(500).send('server error');
    }
}