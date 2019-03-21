const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const bcrypt = require('bcryptjs');
const config = require ('../config/database');
const timestamps = require('mongoose-timestamp');

//Phone Main Category Foot Schema
const PhoneMainCategoryFootSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  products: [{
      type: ObjectId,
       ref: 'Products'
  }],
  sort: {
    type: Number,
    default: 0
  },
});

PhoneMainCategoryFootSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const PhoneMainCategoryFoot = module.exports = mongoose.model('phone_main_category_foot', PhoneMainCategoryFootSchema);
