const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const booking = new Schema({
    bookingByid:{
        type: String
    },
    bookingType:{
        type: String
    },
    pumpId:{
        type: String
    }
})

module.exports = mongoose.model('booking', booking)