const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const timestamps = require('mongoose-timestamp');

//Sale Courier Schema
const SaleCourierSchema = mongoose.Schema({
  sale:{
    type: ObjectId,
    ref: 'Sale'
  },
  courier:{
    type: ObjectId,
    ref:'CourierLocation'
  },
  waybill:{
    type: String,
    default:''
  },
  payment_status:{
    type: String,
    required: true
  },
  payment_amount:{
    type: Number,
    default: 0
  }
});

SaleCourierSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const SaleCourier = module.exports = mongoose.model('sale_courier', SaleCourierSchema);
