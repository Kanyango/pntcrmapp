const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const timestamps = require('mongoose-timestamp');

//Inquiry Schema
const InquirySchema = mongoose.Schema({
  client: {
    type: ObjectId,
    ref: 'Client'
  },
  query: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: ''
  },
  user: {
    type: ObjectId,
    ref: 'User'
  }
});

InquirySchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const Inquiry = module.exports = mongoose.model('inquiry', InquirySchema);
