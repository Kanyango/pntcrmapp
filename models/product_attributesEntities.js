const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

//Products AttributesEntities Schema
const AttribEntitiesSchema = mongoose.Schema({
  attributes: {
    type: ObjectId,
    ref: 'Attributes'
  },
  entities: {
    type: ObjectId,
    ref: 'Entities'
  }
});

const AttribEntities = module.exports = mongoose.model('p_attributes_entities', AttribEntitiesSchema);
