const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const timestamps = require('mongoose-timestamp');

//Repair Schema
const RepairSchema = mongoose.Schema({
  client: {
    type: ObjectId,
    ref: 'Client'
  },
  status: {
    type: String,
    default: ''
  }
});

RepairSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const Repair = module.exports = mongoose.model('repair', RepairSchema);
