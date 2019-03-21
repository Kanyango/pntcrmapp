const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const config = require ('../config/database');
const timestamps = require('mongoose-timestamp');

//Sale Schema Web
const SaleWebContactSellerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  product: {
    type: ObjectId,
    ref: 'Products'
  },
  status:{
    type: String,
    required: true
  },
  note: {
    type: String,
    default: ''
  },
});

SaleWebContactSellerSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});


const SaleWebContactSeller = module.exports = mongoose.model('sale_web_contact_seller', SaleWebContactSellerSchema);
