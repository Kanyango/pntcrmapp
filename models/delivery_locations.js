const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const timestamps = require('mongoose-timestamp');

//Delivery Locations Schema
const DeliveryLocationSchema = mongoose.Schema({
  region:{
    type: String,
    required:true
  },
  location:{
    type: String,
    required:true
  }
});

DeliveryLocationSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const DeliveryLocation = module.exports = mongoose.model('delivery_locations', DeliveryLocationSchema);
