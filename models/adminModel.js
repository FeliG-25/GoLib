const mongoose = require('mongoose');
const Courier = require('./courierModel');

const adminSchema = new mongoose.Schema({
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        res: 'User',
        required: [true, 'couriers can\'t be empty']
    },
    couriers: [{
        type: mongoose.Schema.Types.ObjectId,
        res: 'Courier',
        required: [true, 'couriers can\'t be empty']
    }],
    branchs: {
        type: mongoose.Schema.Types.ObjectId,
        res: 'Branch',
        required: [true, 'admin must in spesific branch']
    }
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;