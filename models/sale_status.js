const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const timestamps = require('mongoose-timestamp');

//Sale Status Schema
const SaleStatusSchema = mongoose.Schema({
  sale: {
    type: ObjectId,
    ref: 'Sale'
  },
  status: {
    type: String,
    required: true
  },
  reason:{
    type:String,
    default:'',
    required: false
  }
});

SaleStatusSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const SaleStatus = module.exports = mongoose.model('sale_status', SaleStatusSchema);
