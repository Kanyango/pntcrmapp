const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require ('../config/database');

//VendorPaymentInfo Schema
const VendorPaymentInfoSchema = mongoose.Schema({
  banking: {
    bank_name:{type:String,default:''},
    account:{type:Number, default:''}
  },
  phone: {
      type: Number,
      default:''
  },
  email: {
    type: String,
    unique:true,
    lowercase: true,
    required: true
  },
  location:{
    type: String,
    required: true
  },
  is_active:
  {
    type: Number,
    default: 0
  }
});

const Vendor = module.exports = mongoose.model('vendor', VendorSchema);
