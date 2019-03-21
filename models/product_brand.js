const mongoose = require('mongoose');
const config = require ('../config/database');
const ObjectId = mongoose.Schema.Types.ObjectId;

//Products Brands Schema
const BrandSchema = mongoose.Schema({
  title: {
    type: String,
    unique:true,
    required: true
  },
  url:{
    type:String,
    unique: true,
    default: ''
  },
  logo:{
    type: String,
    default:''
  },
  description:{
    type: String,
    default:''
  },
  footer_seo:{
    type: String,
    default:''
  },
  category: [{
    link:{type: ObjectId,ref: 'Category'},
    footer:{type:String, default:''},
  }],
});


const Brand = module.exports = mongoose.model('product_brands', BrandSchema);
