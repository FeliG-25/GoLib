const express = require('express')
const tourRouter = require('./routes/tourRoutes')
const app = express()

app.use(express.json())
app.use((req,res,next) => {
    req.requestTime = new Date().toISOString();
    next();
})

app.use('/api/v1/tours', tourRouter)

module.exports = app