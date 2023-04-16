const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const userController = require('./../controllers/userController')

function auth (req, res, next) {
    const token = req.header('Authorization');

    if(!token) {
        return res.status(401).json({msg: 'Authorization denied'})
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