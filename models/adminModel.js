const mongoose = require('mongoose');
const Courier = require('./courierModel');

const adminSchema = new mongoose.Schema({
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        res: 'User',
        required: [true, 'couriers can\'t be empty']
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        res: 'Branch',
        required: [true, 'admin must in spesific branch']
    }
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;