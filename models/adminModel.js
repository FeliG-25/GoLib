const mongoose = require('mongoose');
const Courier = require('./courierModel');

const adminSchema = new mongoose.Schema({
    admin_id: {
        type: String
    },
    couriers: {
        type: [Courier.schema],
        required: [true, 'couriers can\'t be empty']
    },
    branch_name: {
        type: String,
        required: [true, 'admin must in spesific branch']
    }
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;