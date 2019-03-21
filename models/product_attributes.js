const mongoose = require('mongoose');
const config = require ('../config/database');

//Products Attributes Schema
const AttributesSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  }
});


const Attributes = module.exports = mongoose.model('product_attributes', AttributesSchema);
