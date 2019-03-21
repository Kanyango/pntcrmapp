const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const timestamps = require('mongoose-timestamp');

//Payment Vendor Imei Schema
const PaymentVendorImeiSchema = mongoose.Schema({
  payment: {
    type: ObjectId,
    ref: 'PaymentVendor'
  },
  collected: {
    type: ObjectId,
    ref: 'CollectedProductsVendorInfo'
  }
});

PaymentVendorImeiSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
const PaymentVendorImei = module.exports = mongoose.model('payment_vendor_imei', PaymentVendorImeiSchema);
