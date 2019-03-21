const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const bcrypt = require('bcryptjs');
const config = require ('../config/database');
const timestamps = require('mongoose-timestamp');

//Phone Main Shipping Schema
const PhoneMainShippingSchema = mongoose.Schema({
  location: {
    type: ObjectId,
    ref: 'DeliveryLocation'
  },
  amount:{
    type: Number,
    default:0
  }
});

PhoneMainShippingSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const PhoneMainShipping = module.exports = mongoose.model('phone_main_shipping', PhoneMainShippingSchema);
