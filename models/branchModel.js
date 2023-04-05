const mongoose = require('mongoose')

const branchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Branch must have name']
    },
    address: {
        type: String,
        required: [true, 'Branch must have spesific address']
    }
});

const Branch = mongoose.model('Branch', branchSchema);

module.exports = Branch;