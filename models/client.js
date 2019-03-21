const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const timestamps = require('mongoose-timestamp');

//Clients Schema
const ClientSchema = mongoose.Schema({
  first_name:{
    type: String,
    required:true
  },
  last_name:{
    type: String,
    required:true
  },
  phone:{
    type: String,
    unique: true,
    required:true
  },
  email:{
    type: String,
    default:''
  },
  location: {
    type: String,
    default: ''
  },
  company:{
    type: String,
    default:''
  }
});

ClientSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const Client = module.exports = mongoose.model('client', ClientSchema);
