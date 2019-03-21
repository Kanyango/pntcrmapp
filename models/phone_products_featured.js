const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const bcrypt = require('bcryptjs');
const config = require ('../config/database');
const timestamps = require('mongoose-timestamp');

//Products Featured Schema
const PhoneProductsFeaturedSchema = mongoose.Schema({
  active: {
    type: Number,
    default: 0
  },
  product: {
    type: ObjectId,
    ref: 'Products'
  }
});

PhoneProductsFeaturedSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const PhoneProductsFeatured = module.exports = mongoose.model('phone_products_featured', PhoneProductsFeaturedSchema);
