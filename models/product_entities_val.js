const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

//Products Entities Schema
const ProductEntitiesSchema = mongoose.Schema({
  products: {
    type: ObjectId,
    ref: 'Products'
  },
  entities: {
    type: ObjectId,
    ref: 'Entities'
  },
  value: {
    type: String,
    required: true
  }
});

const ProductEntities = module.exports = mongoose.model('product_entities_val', ProductEntitiesSchema);
