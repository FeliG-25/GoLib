const mongoose = require('mongoose')

const courierSchema = new mongoose.Schema({
    courier_name: {
        type: String,
        required: [true, 'Courier must have a name']
    },
    phone_number: {
        type: String,
        required: [true, 'Courier must have a phone number']
    },
    number_plate: {
        type: String,
        required: [true, 'Courier must have a detail number plate']
    }
});

const Courier = mongoose.model('Courier', courierSchema);

module.exports = Courier;