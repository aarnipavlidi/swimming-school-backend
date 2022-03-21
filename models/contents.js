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
      min: 0,
    },
    OneTimeDuo: {
      type: Number,
      min: 0,
    },
    ThreeTimeSolo: {
      type: Number,
      min: 0,
    },
    ThreeTimeDuo: {
      type: Number,
      min: 0,
    },
    FiveTimeSolo: {
      type: Number,
      min: 0,
    },
    FiveTimeDuo: {
      type: Number,
      min: 0,
    },
  },
  content: {
    secondaryElement: [
      {
        type: String,
        default: null,
        required: true,
      },
    ],
    primaryElement: [
      {
        type: String,
        default: null,
        required: true,
      },
    ],
  },
  footer: {
    location: {
      address: {
        type: String,
      },
      postalCode: {
        type: Number,
      },
      city: {
        type: String,
      },
    },
    contact: {
      phoneNumber: {
        type: Number,
      },
      email: {
        type: String,
      },
    },
  },
});

schema.plugin(uniqueValidator);
module.exports = mongoose.model('Contents', schema);