const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const timestamps = require('mongoose-timestamp');

//Courier Location Schema
const CourierLocationSchema = mongoose.Schema({
  courier:{
    type: ObjectId,
    ref:'Courier'
  },
  branch:{
    type: ObjectId,
    ref:'DeliveryLocation'
  },
  amount:{
    type: String,
    default:0
  },
  info:{
    phone:{type: String,default:''},
    email: {type: String, default:''}
  }
});

CourierLocationSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const CourierLocation = module.exports = mongoose.model('courier_location', CourierLocationSchema);
