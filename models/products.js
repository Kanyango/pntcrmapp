const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const timestamps = require('mongoose-timestamp');

//Products Schema
const ProductsSchema = mongoose.Schema({
  category: {
    type: ObjectId,
    ref: 'Category'
  },
  brand: {
    type: ObjectId,
    ref: 'Brand'
  },
  attribute:{
    type: ObjectId,
    ref: 'Attributes'
  },
  title: {
      type: String,
      default:''
  },
  url:{
    type:String,
    unique: true,
    default: ''
  },
  price:{
      type:Number,
      required: true
  },
  reseller_price:{
      type:Number,
      dafault: 0
  },
  cost: {
    type: Number,
    required: true
  },
  is_active:{
    type: Number,
    default: 0
  },
  is_web_active:{
    type: Number,
    default: 0
  },
  special_price: {
    type: Number,
    default:0
  },
  descriptions:{
    box_content:{type:String, default:''},
    short:{type:String, default:''},
    full:{type:String, default:''},
    youtube:{type:String, default:''}
  },
  images:{
    type:Array,
    default:''
  },
  image_front_small:{
    type:String,
    default:''
  },
  image_front_big:{
    type:String,
    default:''
  },
  associate_products:{
    type:Array,
    default:''
  },
  seo:{
    title:{type:String, default:''},
    keywords:{type:String, default:''},
    description:{type:String, default:''}
  },
  deleted: {
    type: Number,
    default: 0
  },
  tags:{
    type: Array,
    default: ''
  },
  stock:{
    type: Number,
    default: 1
  },
  desc_entity: [{
    entity:{type:ObjectId, ref: 'Entities'},
    value:{type:String, required: true}     
}]
});

ProductsSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const Products = module.exports = mongoose.model('products', ProductsSchema);
