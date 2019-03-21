const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const config = require ('../config/database');

//Sale Schema
const SaleProductsSchema = mongoose.Schema({
  sale: {
    type: ObjectId,
    ref: 'Sale'
  },
  product: {
    type: ObjectId,
    ref: 'CollectedProductsVendor'
  },
  qty: {
    type: Number,
    default:1
  },
  price: {
    type: Number,
    default: 0
  },
  cost: {
    type: Number,
    default: 0
  }
});


const SaleProducts = module.exports = mongoose.model('sale_products', SaleProductsSchema);
