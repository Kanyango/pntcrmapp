const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const timestamps = require('mongoose-timestamp');

//Reminder Inquiry Schema
const ReminderInquirySchema = mongoose.Schema({
  reminder: {
    type: ObjectId,
    ref: 'Reminder'
  },
  inquiry:{
    type:ObjectId,
     ref:'Inquiry'
   }
});

ReminderInquirySchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const ReminderInquiry = module.exports = mongoose.model('reminder_inquiry', ReminderInquirySchema);
