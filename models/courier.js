const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const timestamps = require('mongoose-timestamp');

//Courier Schema
const CourierSchema = mongoose.Schema({
  name:{
    type: String,
    required:true
  },
  phone:{
    type: String,
    required:true
  },
  email:{
    type: String,
    default:''
  }
});

CourierSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const Courier = module.exports = mongoose.model('courier', CourierSchema);
