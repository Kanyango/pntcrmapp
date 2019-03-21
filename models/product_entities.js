const mongoose = require('mongoose');
const config = require ('../config/database');

//Products Entities Schema
const EntitiesSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  identifier: {
    type: String,
    required: true,
    unique: true
  },
  input_type: {
    type: String,
    required: true
  },
  required: {
    type: Number,
    required: true
  },
  options: {
    type: Array,
    default: ''
  }
});


const Entities = module.exports = mongoose.model('product_entities', EntitiesSchema);
