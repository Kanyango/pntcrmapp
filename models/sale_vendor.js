const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const bcrypt = require('bcryptjs');
const config = require ('../config/database');

//SaleVendor Schema
const SaleVendorSchema = mongoose.Schema({
  sale: {
    type: ObjectId,
    ref: 'Sale'
  },
  vendor: {
    type: ObjectId,
    ref: 'Vendor'
  }
});


const SaleVendor = module.exports = mongoose.model('sale_vendor', SaleVendorSchema);
