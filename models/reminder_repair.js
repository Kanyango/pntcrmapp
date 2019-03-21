const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const timestamps = require('mongoose-timestamp');

//Reminder Repair Schema
const ReminderRepairSchema = mongoose.Schema({
  reminder: {
    type: ObjectId,
    ref: 'Reminder'
  },
  repair:{
    type:ObjectId,
     ref:'Repair'
   }
});

ReminderRepairSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const ReminderRepair = module.exports = mongoose.model('reminder_repair', ReminderRepairSchema);
