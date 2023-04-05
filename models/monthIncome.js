const mongoose = require('mongoose')

const monthIncomeSchema = new mongoose.Schema({
    month_name: {
        type: String
    },
    sum_borrows: {
        type: Number
    },
    month_income: {
        type: Number
    }
});

const MonthIncome = mongoose.model('MonthIncome', monthIncomeSchema);

module.exports = MonthIncome;