const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'user must have username']
    },
    email: {
        type: String,
        required: [true, 'user must have email']
    },
    password: {
        type: String,
        required: [true, 'user must have password']
    },
    userType: {
        type: String,
        required: [true, 'user must have spesific type']
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;