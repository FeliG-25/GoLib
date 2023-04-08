const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

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

userSchema.pre('save', function (next){
    const user = this;

    if(!user.isModified('password')){
        return next()
    }

    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) {
            return next(err);
        }

        user.password = hash;
        next()
    });
})

const User = mongoose.model('User', userSchema);

module.exports = User;