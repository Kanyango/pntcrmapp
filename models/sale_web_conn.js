const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const timestamps = require('mongoose-timestamp');

//Sale Schema
const SaleWebConnSchema = mongoose.Schema({
  web: {
    type: ObjectId,
    ref: 'SaleWeb'
  },
  sale: {
    type: ObjectId,
    ref: 'Sale'
  }
});

SaleWebConnSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
const SaleWebConn = module.exports = mongoose.model('sale_web_conn', SaleWebConnSchema);
