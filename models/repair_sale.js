const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const bcrypt = require('bcryptjs');
const config = require ('../config/database');

//RepairSale Schema
const RepairSaleSchema = mongoose.Schema({
  repair: {
    type: ObjectId,
    ref: 'Repair'
  },
  sale: {
    type: ObjectId,
    ref: 'Sale'
  }
});


const RepairSale = module.exports = mongoose.model('repair_sale', RepairSaleSchema);
