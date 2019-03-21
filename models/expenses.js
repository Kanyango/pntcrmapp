const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const timestamps = require('mongoose-timestamp');

//Expenses Schema
const ExpensesSchema = mongoose.Schema({
  category: {
    type: ObjectId,
    ref: 'ExpensesCategory'
  },
  amount: {
    type: Number,
    required: true
  },
  user: {
    type: ObjectId,
    ref: 'User'
  }
});

ExpensesSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
const Expenses = module.exports = mongoose.model('expenses', ExpensesSchema);
