const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const timestamps = require('mongoose-timestamp');

//Payment Vendor Schema
const PaymentVendorSchema = mongoose.Schema({
  vendor:{
    type:ObjectId,
    ref: 'Vendor'
  },
  amount:{
    type:Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  note: {
    type: String,
    default: 0
  },
  user: {
    type: ObjectId,
    ref: 'User'
  }
});

PaymentVendorSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
const PaymentVendor = module.exports = mongoose.model('payment_vendor', PaymentVendorSchema);
