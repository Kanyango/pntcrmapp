const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const timestamps = require('mongoose-timestamp');

//Colllected ProductsVendor Schema
const CollectedProductsVendorSchema = mongoose.Schema({
  product: {
    type: ObjectId,
    ref: 'Products'
  },
  vendor: {
    type: ObjectId,
    ref: 'Vendor'
  },
  col_user: {
    type: ObjectId,
    ref: 'User'
  },
  cost:{
    type: Number,
    required: true,
    default: 0
  },
  user:{
    type: ObjectId,
    ref: 'User'
  }

});

CollectedProductsVendorSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
const CollectedProductsVendor = module.exports = mongoose.model('collected_product_vendor', CollectedProductsVendorSchema);
