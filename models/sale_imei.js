const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const timestamps = require('mongoose-timestamp');

//Sale Schema
const SaleImeiSchema = mongoose.Schema({
  sale: {
    type: ObjectId,
    ref: 'SaleProducts'
  },
  imei:{
    type: ObjectId,
    ref: 'CollectedProductsVendorInfo'
  }
});

SaleImeiSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const SaleImei = module.exports = mongoose.model('sale_imei', SaleImeiSchema);
