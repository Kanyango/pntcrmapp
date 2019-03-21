const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const timestamps = require('mongoose-timestamp');

//Colllected ProductsVendor Info Schema
const CollectedProductsVendorInfoSchema = mongoose.Schema({
  collected:{
    type: ObjectId,
    ref: 'CollectedProductsVendor'
  },
  imei: {
    type: String,
    unique: true,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  pay: {
    type: Number,
    default: 0
  }

});

CollectedProductsVendorInfoSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const CollectedProductsVendorInfo = module.exports = mongoose.model('collected_product_vendor_info', CollectedProductsVendorInfoSchema);
