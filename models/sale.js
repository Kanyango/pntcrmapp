const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const timestamps = require('mongoose-timestamp');

//Sale Schema
const SaleSchema = mongoose.Schema({
  status: {
    type: String,
    default:''
  },
  client: {
    type: ObjectId,
    ref: 'Client'
  },
  user: {
    type: ObjectId,
    ref: 'User'
  },
  source:{
    type: String,
    default: 'store'
  }
});

SaleSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
const Sale = module.exports = mongoose.model('sale', SaleSchema);
