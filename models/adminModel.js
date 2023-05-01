const mongoose = require('mongoose');
const Courier = require('./courierModel');

const adminSchema = new mongoose.Schema({
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        res: 'User',
        required: [true, 'couriers can\'t be empty']
    }
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;