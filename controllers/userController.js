const user = require('./../models/userModel');
const member = require('./../models/memberModel');


exports.createUser = async (req, res) => {
    try {
        const newMember = await member.create(req.body);
        const newUser = await user.create(req.body);
        
        res.status(201).json({
            status: 201,
            message: 'Registered! Please Login'
        });
    } catch (err) {
        res.status(400).json({
            status:'Register Failed!',
            message: err
        });
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await user.find({});

        res.status(200).json({
            status: 'ini kmn si bro nyambungnya',
            result: users.length,
            data: {
                users
            }
        });
    } catch (err) {
        res.status(400).json({
            status:'fail',
            message: 'gagal bosquw'
        })
    }
}