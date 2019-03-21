const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const bcrypt = require('bcryptjs');
const config = require ('../config/database');
const timestamps = require('mongoose-timestamp');

//Phone Main Slider Schema
const PhoneMainSliderSchema = mongoose.Schema({
  link: {
    type: String,
    default: '#'
  },
  image: {
    type: String,
    required: true
  },
  image_mobile: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: true
  },
  sort: {
    type: Number,
    default: 0
  }
});

PhoneMainSliderSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const PhoneMainSlider = module.exports = mongoose.model('phone_main_slider', PhoneMainSliderSchema);
