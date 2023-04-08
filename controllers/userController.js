const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

const User = require('./../models/userModel');
const Member = require('./../models/memberModel');

dotenv.config({path: './config.env'});


exports.createUser = async (req, res) => {
    const { user_name, password, email, user_type} = req.body;
    try {

        // Check if username is already taken
        const existingUser = await User.findOne({ user_name });
        if (existingUser){
            return res.status(400).json({
                status: 'fail',
                message: 'Username is already taken'
            });
        }

        const newMember = await Member.create(req.body);
        const newUser = new User({user_name, password, email, user_type})
        await newUser.save();
        
        // const newUser = await User.create(req.body);
        
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


exports.login = async (req, res) => {
    const { user_name, password } = req.body;

    try {
        const user = await User.findOne({user_name});
        const member = await Member.findOne({user_name});

        //If there is no user
        if (!user && !member){
            return res.status(401).json({
                status: '401',
                message: 'Invalid credential'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({
                status: 400,
                message: 'Invalid Password'
            });
        }

        const payload = {user: {id: user.id}};
        const token = jwt.sign(payload, process.env.SECRET, {expiresIn: 3000000});

        res.status(300).json({
            status:200,
            user: user,
            member: member,
            token: token
        })

    } catch (err){
        console.error(err);
        res.status(500).json({
            message: 'Internal server error'
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