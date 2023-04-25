const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser');
const User = require('./../models/userModel')
const Member = require('./../models/memberModel')
const mongoose = require('mongoose')
const ActiveUser = require ('./../models/activeUser')
const Cart = require('../models/cartModel')
const Admin = require('../models/adminModel')

dotenv.config({path: './config.env'});

exports.createUser = async (req, res) => {
    const { email, password, full_name, user_name, birth_date, phone_number, address, balance, user_type } = req.body;
    try {

        // Check if username is already taken
        const existingUser = await User.findOne({ email });
        
        if (existingUser){
            return res.status(400).json({
                status: 'fail',
                message: 'Email is already taken'
            });
        }

        let savedUser = User

        const newMember = await Member.create(req.body);
        const newCart = await Cart.create({books: []});
        const newUser = new User({user_name, password, email, user_type})
        await newUser.save().then(user => {
            console.log("Added new user: ", user);
            newMember.member_id = user._id
            newMember.cart = newCart._id
            newMember.save()
            savedUser = user;
        });
        
        res.status(201).json({
            status: 201,
            message: 'Registered! Please Login'
        });
    } catch (err) {
        console.log(err)
        res.status(400).json({
            status:'Register Failed!',
            message: err
        });
    }
}

exports.logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.clearCookie('user');
        
        res.status(200).json({
            status: 200,
            message: "Successfully logout!"
        })


    } catch (err){
        console.error(err);
        res.status(500).json({
        message: 'Internal server error'
        });
    }
}


exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({email}, 'password user_type');
        const userId = user._id
        var member = Member
        var admin = Admin

        if (user.user_type === 'MEMBER') {
            member = await Member.findOne({'member_id': userId}).exec();
        } else {
            admin = await Admin.findOne({'admin_id': userId}).exec();
        }

        //If there is no user
        if ((!user && !member) || (!user && !admin)){
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

        const payload = {id: userId};
        const token = jwt.sign(payload, process.env.SECRET, {expiresIn: '1h'});

        //set cookie tokennya
        res.cookie('token', token, {
            httpOnly: false,
            secure: false,
            maxAge: 3600 * 1000 //1 jam
        });

        //set cookie user
        res.cookie('user', JSON.stringify(user), {
            httpOnly: false,
            secure: false,
            maxAge: 3600 * 1000 //1 jam
        })
        
        if (user.user_type == 'MEMBER') {
            res.status(200).json({
                message: 'Logged in! Welcome back, '+member.full_name+'!'
            });
        } else {
            res.status(200).json({
                message: 'Logged in! Welcome back, admin!'
            });
        }
        
        
    } catch (err){
        console.error(err);
        res.status(500).json({
            message: 'Internal server error'
        });
    }

}

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        const member = await Member.findOne({'member_id': user._id})

        let result = {
            full_name: member.full_name,
            user_name: user.user_name,
            birth_date: member.birth_date,
            phone: member.phone,
            email: user.email,
            address: member.address,
            balance: member.balance
        }
        
        res.status(200).json({
            status: '200',
            message: 'Success!',
            data: result
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await user.find({});

        res.status(200).json({
            result: users.length,
            data: {
                users
            }
        });
    } catch (err) {
        res.status(400).json({
            status:'fail',
            message: 'Failed to get users'
        })
    }
}

exports.updateUserPassword = async (req, res) => {
    try{
        const user = await User.findById(req.params.id);

        const { current_pw, new_pw, confirm_new } = req.body
        if (current_pw != user.password) {
            return res.status(400).json({
                status: 'fail',
                message: "Current password doesn't match"
            });
        } else if ( new_pw != confirm_new ) {
            return res.status(400).json({
                status: 'fail',
                message: "New password must match with confirm"
            });
        } else {
            const upd_user = await User.findByIdAndUpdate(req.params.id, {password: new_pw}, {
                new: true,
                runValidators: true
            });

            res.status(201).json({
                status: 'success',
                data: {
                    upd_user
                }
            });
        }
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
}

exports.updateUserProfile = async (req, res) => {
    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        const member = await Member.findOneAndUpdate({'member_id':user._id}, req.body, {
            new:true,
            runValidators: true
        })

        res.status(201).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}