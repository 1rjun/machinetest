const mongoose = require('mongoose');
const Schema = mongoose.Schema

const pumpModule = new Schema({
    pumpName: {
        type: String
    },
    pumpLocation:{
        type: {
            type: String
        },
        coordinates: [Number]
    },
    pumpUserid:{
        type: String
    },
    pumpPassword:{
        type: String
    }

})

module.exports = mongoose.model('pumpModule', pumpModule)