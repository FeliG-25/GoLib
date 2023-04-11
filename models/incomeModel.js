const mongoose = require('mongoose');
const MonthIncome = require('./monthIncome');

const incomeSchema = new mongoose.Schema({
    branchs: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: [true, 'admin must in spesific branch']
    },
    month_income: [{
        type: MonthIncome.schema
    }]
});

const Income = mongoose.model('Income', incomeSchema);

module.exports = Income;