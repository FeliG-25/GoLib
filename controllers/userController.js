const user = require('./../models/userModel');


exports.createUser = async (req, res) => {
    try {
        const newUser = await user.create(req.body);

        res.status(201).json({
            status: 'success',
            sata: {
                user: newUser
            }
        });
    } catch (err) {
        res.status(400).json({
            status:'fail',
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