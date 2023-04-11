const Transaction = require('../models/transactionModel');
const Book = require('./../models/bookModel');
const Courier = require('./../models/courierModel')
const MonthIncome = require('./../models/monthIncome')
const Member = require('./../models/memberModel')
const mongoose = require('mongoose');

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
    const { admin_branch } = req.body //<- ini buat cek branch kurir tapi nanti deh 
    try {
        const borrowsData = await Transaction.find({status: 'borrow_process'}, 'borrow_date');
        const courierData = await Courier.find({courier_status: 'available', branch_id: mongoose.Types.ObjectId(admin_branch)}, 'courier_name')
        
        // for(var i = 0; i < courierData.length; i++) {
        //     if(courierData[i].branch_id.toString() !== admin_branch) {
        //         courierData.splice(i,1)
        //     }
        // }

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

//dari sini kebawah itu untuk testing aja memahami gimana penyimpanan di db nya gitu :)
//buat change borrowing state harus tau isi transactionnya dulu jadi kita coba get all transactions
// exports.getAllTransactionTest = async (req, res) => {
//     try {
//         const transaction = await Transaction.find({}).populate('books')
//         res.status(201).json({
//             status: 'success',
//             results: transaction.length,
//             data: {
//                 transactions: transaction
//             }
//         })
//     } catch {
//         res.status(400).json({
//             status: 'fail',
//             message: 'Invalid data sent!'
//         })
//     }
// }

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

//buat get income seengaknya harus tau price n fee dari masing masing transaction
exports.getIncomeTest = async (req, res) => {
    try {
        const transaction = await Transaction.find({}, 'price fee borrow_date')
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

//buat top up setidaknya harus tau data pengguna dan balance yang mereka punya sekarang
// exports.getMemberTest = async (req, res) => {
//     try {
//         // const member = await Member.findOne({member_id:mongoose.Types.ObjectId("6433780767449341884299cc")})
//         const member = await Member.find({},'member_id balance')
//         console.log(member[0].member_id.toString() === "6433780767449341884299cc")
//         res.status(201).json({
//             status: 'success',
//             results: member.length,
//             data: {
//                 members: member
//             }
//         })
//     } catch {
//         res.status(400).json({
//             status: 'fail',
//             message: 'Invalid data sent!'
//         })
//     }
// }
exports.topUpUserBalance = async (req, res) => {
    //sementara gini dulu idenya
    try {
        const member_old = await Member.findOne({member_id:mongoose.Types.ObjectId(req.params.id)}, 'balance')
        const member_new = await Member.findOneAndUpdate({member_id: mongoose.Types.ObjectId(req.params.id)},{$inc:{balance: Number(req.body.top_up_value)}},{new:true, projection: {balance:1}})
        // var temp = -1
        // var members = await Member.find({},'member_id balance')
        // for(var i = 0; i < members.length; i++) {
        //     if(members[i].member_id.toString() == req.params.id) {
        //         members[i].balance += Number(req.body.top_up_value)
        //         await members[i].save();
        //         temp = i
        //     }
        // }
        // members = await Member.find({},'member_id balance')
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

// exports.getIncome = async (req, res) => {
//     try {
//         const incomes = await MonthIncome.aggregate([
//             {
//                 $match: {
//                     'books.branchId': branch_id
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'transaction',
//                     localField: 'transaction._id',
//                     foreignField: 'transaction._id',
//                     as: 'transaction'
//                 }
//             },
//             {
//                 $lookup: {
//                   from: 'books',
//                   localField: 'borrowslist.books._id',
//                   foreignField: 'books._id',
//                   as: 'stocks'
//                 }
//             },
//             {
//                 $group: {
//                   _id: {
//                     borrowId: '$transaction._id',
//                     branchId: '$books.branch_id',
//                     month: { $month: '$transaction.borrow_date' }
//                   },
//                   MonthName: { $first: { $monthName: '$transaction.borrow_date' } },
//                   SumBorrows: { $sum: '$transaction._id' },
//                   Income: { $sum: '$transaction.price' }
//                 }
//             },
//             {
//                 $sort: {
//                   '_id.month': 1,
//                   '_id.branchId': 1
//                 }
//             }
//         ])
//     } catch {

//     }
// }

// exports.topUpUserBalance = async (req, res) => {
//     const {user_id, top_up_value} = req.body
//     try {
//         await Member.updateOne({_id: user_id}, {$inc: { balance: parseInt(top_up_value)}}, {new: true});
//     } catch {

//     }
// }

