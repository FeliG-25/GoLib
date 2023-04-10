const mongoose = require('mongoose');
const User = require('./userModel');
const Transaction = require('./transactionModel');
const Cart = require('./cartModel');

const memberSchema = new mongoose.Schema({
    member_id: {
        type: String
    },
    full_name: {
        type: String,
        required: [true, 'Member must have spesific name']
    },
    email: {
        type: String,
        required: [true, 'Member must have spesific email']
    },
    balance: {
        type: Number,
        required: [true, 'Member must have spesific balance']
    },
    birth_date: {
        type: String
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
        type: [Transaction.schema],
        required: false
    },
    cart: {
        type: Cart.schema,
        required: [false, 'Member must have one active cart']
    }
});

const MemberResponseSchema = new mongoose.Schema({
    user_name: String,
    birth_date: String,
    phone_number: String,
    email: String,
    addres: String,
    balance: String,
    full_name: String,
})

const Member = mongoose.model('Member', memberSchema);
const MemberResponse = mongoose.model('Member Response', MemberResponseSchema);

module.exports = {Member, MemberResponse};