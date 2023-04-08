const express = require('express');
const userRouter = require('./routes/userRoutes');
const app = express()

app.use(express.json())
app.use((req,res,next) => {
    req.requestTime = new Date().toISOString();
    next();
})

// routes for users
app.use('/api/v1', userRouter)

module.exports = app