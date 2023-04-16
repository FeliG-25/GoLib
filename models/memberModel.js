const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    member_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [false, 'Member ID can\'t be empty']
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
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        required: false
    }],
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: [false, 'Member must have one active cart']
    }
});


const Member = mongoose.model('Member', memberSchema);

module.exports = Member;