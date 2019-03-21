const mongoose = require('mongoose');
const config = require ('../config/database');

//Tags Schema
const TagsSchema = mongoose.Schema({
  title: {
      type: String,
      unique: true,
      required: true
  },
  url:{
    type:String,
    unique: true,
    default: ''
  }
});

const Tags = module.exports = mongoose.model('product_tags', TagsSchema);
