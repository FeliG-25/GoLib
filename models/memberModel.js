const mongoose = require('mongoose');
const User = require('./userModel');
const Borrowing = require('./transactionModel');

const memberSchema = new mongoose.Schema({
    member_id: {
        type: String
    },
    balance: {
        type: Number,
        required: [true, 'Member must have spesific balance']
    },
    birth_date: {
        type: Date
    },
    phone_number: {
        type: String,
        required: [true, 'Phone can\'t be empty']
    },
    address: {
        type: String,
        required: [true, 'Member address can\'t be empty']
    },
    transactions: {
        type: [Borrowing]
    },
    cart: {
        type: Cart,
        required: [true, 'Member must have one active cart']
    }
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;