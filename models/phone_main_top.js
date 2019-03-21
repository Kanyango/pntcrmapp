const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const bcrypt = require('bcryptjs');
const config = require ('../config/database');
const timestamps = require('mongoose-timestamp');

//Phone Main Top Schema
const PhoneMainTopSchema = mongoose.Schema({
  image: {
      type: String,
      required: true
  },
  product: {
      type: ObjectId,
       ref: 'Products'
  }
});

PhoneMainTopSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const PhoneMainTop = module.exports = mongoose.model('phone_main_top', PhoneMainTopSchema);
