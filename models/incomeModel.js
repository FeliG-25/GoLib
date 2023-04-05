const mongoose = require('mongoose');
const MonthIncome = require('./monthIncome');

const incomeSchema = new mongoose.Schema({
    branch_name: {
        type: String
    },
    month_income: {
        type: [MonthIncome]
    }
});

const Income = mongoose.model('Income', incomeSchema);

module.exports = Income;