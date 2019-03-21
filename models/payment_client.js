const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const timestamps = require('mongoose-timestamp');

//Payment Client Schema
const PaymentClientSchema = mongoose.Schema({
  sale: {
    type: ObjectId,
    ref: 'Sale'
  },
  mode_of_pay:{
    type:Array,
    required: true
  },
  amount:{
    type:Number,
    required: true
  },
  balance: {
    type: Number,
    required:true
  },
  user: {
    type: ObjectId,
    ref: 'User'
  }
});

PaymentClientSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
const PaymentClient = module.exports = mongoose.model('payment_client', PaymentClientSchema);
