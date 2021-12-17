const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const schema = new mongoose.Schema({
    value: {
        type: String,
        unique: true,
        required: true,
    },
    pricing: {
        OneTimeSolo: {
            type: Number,
            default: 0,
            min: 0,
        },
        OneTimeDuo: {
            type: Number,
            default: 0,
            min: 0,
        },
        ThreeTimeSolo: {
            type: Number,
            default: 0,
            min: 0,
        },
        ThreeTimeDuo: {
            type: Number,
            default: 0,
            min: 0,
        },
        FiveTimeSolo: {
            type: Number,
            default: 0,
            min: 0,
        },
        FiveTimeDuo: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
});

schema.plugin(uniqueValidator);
module.exports = mongoose.model('Contents', schema);