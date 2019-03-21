const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const timestamps = require('mongoose-timestamp');

//Reminder Schema
const ReminderSchema = mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  user: {
    type: ObjectId,
    ref: 'User'
  }
});
ReminderSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const Reminder = module.exports = mongoose.model('reminder', ReminderSchema);
