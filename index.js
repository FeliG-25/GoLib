const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');

const app = express()

app.use(express.json())
app.use(cors())

app.use((req,res,next) => {
    req.requestTime = new Date().toISOString();
    next();
})

// routes for users
app.use('/api/v1', userRouter)

// routes for admin
app.use('/api/v1/admin', adminRouter)

module.exports = app