const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const user = new Schema({
    userName: {
        type: String,
        default: null
    },
    userId:{
        type: String
    },
    userPassword: {
        type: String
    },
    avatar:{
        type: String
    }
})

module.exports = mongoose.model('customer', user)