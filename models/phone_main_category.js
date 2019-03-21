const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const bcrypt = require('bcryptjs');
const config = require ('../config/database');
const timestamps = require('mongoose-timestamp');

//Phone Main Slider Schema
const PhoneMainCategorySchema = mongoose.Schema({
  category: {
    type: ObjectId,
    ref: 'Category'
  },
  image: {
    img:{type: String,required: true},
    link:{type: String,required: true},
    alt:{type: String,required: true}
  },
  products: [{
      type: ObjectId,
       ref: 'Products'
  }],
  bottom_image: {
    img:{type: String,default: ''},
    link:{type: String,default: ''},
    alt:{type: String,default: ''}
  },
  brands: [{ type: ObjectId, ref: 'Brand' }],
});

PhoneMainCategorySchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const PhoneMainCategory = module.exports = mongoose.model('phone_main_category', PhoneMainCategorySchema);
