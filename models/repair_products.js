const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

//Repair Products Schema
const RepairProductsSchema = mongoose.Schema({
  repair: {
    type: ObjectId,
    ref: 'Repair'
  },
  title:{
    type:String,
     default:''
   },
  imei:{
    type:String,
    default:''
  },
  issue:{
    type: String,
    required: true
  },
  status: {
    type: String,
    default: ''
  },
  cost:{
    type: Number,
    default: 0
  }
});

const RepairProducts = module.exports = mongoose.model('repair_products', RepairProductsSchema);
