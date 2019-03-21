const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const timestamps = require('mongoose-timestamp');

//Sale Schema
const SaleShippedSchema = mongoose.Schema({
  sale: {
    type: ObjectId,
    ref: 'SaleProducts'
  },
  courier:{
    type: ObjectId,
    ref: 'Courier'
  }
});

SaleShippedSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const SaleShipped = module.exports = mongoose.model('sale_shipped', SaleShippedSchema);
