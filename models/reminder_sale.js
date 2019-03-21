const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const timestamps = require('mongoose-timestamp');

//Reminder Sale Schema
const ReminderSaleSchema = mongoose.Schema({
  reminder: {
    type: ObjectId,
    ref: 'Reminder'
  },
  sale:{
    type:ObjectId,
     ref:'Sale'
   }
});

ReminderSaleSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const ReminderSale = module.exports = mongoose.model('reminder_sale', ReminderSaleSchema);
