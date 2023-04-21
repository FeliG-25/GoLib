const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const userController = require('./../controllers/userController')
const ActiveUser = require('./../models/activeUser')

function auth (req, res, next) {
    const token = req.header('Authorization');

    if(!token) {
        return res.status(401).json({msg: 'Authorization denied'})
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET)
        const activeUserId = ActiveUser.getActiveUser();

        // console.log('active user Id: '+activeUserId)
        req = decoded;
        next()
    } catch (err) {
        console.log(err)
        res.status(401).json({msg: "Token is not valid"})
    }
}

module.exports = auth;