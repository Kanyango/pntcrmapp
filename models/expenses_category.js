const mongoose = require('mongoose');
const config = require ('../config/database');

//Expenses Category Schema
const ExpensesCategorySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  }
});


const ExpensesCategory = module.exports = mongoose.model('expenses_category', ExpensesCategorySchema);
