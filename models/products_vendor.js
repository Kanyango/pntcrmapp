const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const bcrypt = require('bcryptjs');
const config = require ('../config/database');
const timestamps = require('mongoose-timestamp');

//ProductsVendor Schema
const ProductsVendorSchema = mongoose.Schema({
  products: {
    type: ObjectId,
    ref: 'Products'
  },
  vendor: {
    type: ObjectId,
    ref: 'Vendor'
  },
  cost:{
    type: Number,
    required: true
  },
  feature:{
    type: String,
    default: ''
  }
});

ProductsVendorSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const ProductsVendor = module.exports = mongoose.model('products_vendor', ProductsVendorSchema);
