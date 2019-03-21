const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const timestamps = require('mongoose-timestamp');

//Repair Payment Schema
const RepairPaymentSchema = mongoose.Schema({
  repair: {
    type: ObjectId,
    ref: 'Repair'
  },
  amount:{
    type:Number,
     default:0
   }
});

RepairPaymentSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const RepairPayment = module.exports = mongoose.model('repair_payment', RepairPaymentSchema);
