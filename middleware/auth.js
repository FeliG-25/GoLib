const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

function auth (req, res, next) {
    const token = req.header('Authorization');

    if(!token) {
        return res.status(401).json({msg: 'Authorization denied'})
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET)
        // console.log("decoded email: "+decoded.user)
        req.user = decoded.user;
        console.log("decoded email: "+decoded.user)
        next()
    } catch (err) {
        console.log(err)
        res.status(401).json({msg: "Token is not valid"})
    }
}

module.exports = auth;