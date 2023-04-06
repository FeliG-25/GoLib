const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    user_name: {
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
    user_type: {
        type: String,
        required: [true, 'user must have spesific type']
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;