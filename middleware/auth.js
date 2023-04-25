const express = require('express');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const userController = require('./../controllers/userController')
const ActiveUser = require('./../models/activeUser')
const cookieParser = require('cookie-parser');

const app = express()
app.use(cookieParser())

function auth(role) {
    return function(req, res, next) {
        const token = req.cookies.token;
        const user = JSON.parse(req.cookies.user);
        if(token) {
          req.headers['Authorization'] = `Bearer ${token}`;
          console.log(user)
          console.log(user.user_type)
        } else if(!token) {
          return res.status(401).json({msg: 'Please login first'})
        }
        
        try {
          const decoded = jwt.verify(token, process.env.SECRET)
          req = decoded;
          if (role !== user.user_type) {
            return res.status(403).json({msg: 'Access denied'});
          }
          next()
        } catch (err) {
          console.log(err)
          res.status(401).json({msg: "Token is not valid"})
        }
      }
}

module.exports = auth;