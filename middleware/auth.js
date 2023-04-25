const express = require('express');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const userController = require('./../controllers/userController')
const ActiveUser = require('./../models/activeUser')
const cookieParser = require('cookie-parser');

const app = express()
app.use(cookieParser())

function auth (req, res, next) {
    const token = req.cookies.token;
    if(token) {
        req.headers['Authorization'] = `Bearer ${token}`;
    } else if(!token) {
        return res.status(401).json({msg: 'Please login first'})
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET)
        req = decoded;
        next()
    } catch (err) {
        console.log(err)
        res.status(401).json({msg: "Token is not valid"})
    }
}

module.exports = auth;