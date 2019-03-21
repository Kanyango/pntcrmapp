const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const config = require ('../config/database');
const timestamps = require('mongoose-timestamp');

//Sale Schema
const SaleWebSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  cart: [{
    quantity:{type:Number},
    price: {type:Number},
    productId: {
        type: ObjectId,
         ref: 'Products'
    }
  }],
  delivery_location: {
    type: String,
    required: true
  },
  shipping: {
      type: ObjectId,
       ref: 'PhoneMainShipping'
  },
  status: {
    type: String,
    required: true
  }

});

SaleWebSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});


const SaleWeb = module.exports = mongoose.model('sale_web', SaleWebSchema);
