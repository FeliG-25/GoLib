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
        const userCookie = req.cookies.user;
        let user;
        // const user = JSON.parse(req.cookies.user);
        if(token) {
          req.headers['Authorization'] = `Bearer ${token}`;
        } else if(!token) {
          return res.status(401).json({msg: 'Please login first'})
        }
        
        try {
          const decoded = jwt.verify(token, process.env.SECRET)
          req = decoded;
          if(userCookie){
            user = JSON.parse(userCookie);
            if (!role.includes(user.user_type)) {
              return res.status(403).json({msg: 'Your role don\'t have access to this menu'});
            }
          } else {
            return res.status(401).json({msg: 'Please login first'})
          }
          next()
        } catch (err) {
          console.log(err)
          res.status(401).json({msg: "Token is not valid"})
        }
      }
}

module.exports = auth;