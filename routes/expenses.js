const express = require('express');
const router = express.Router();

let Products = require('../models/products');
let Expenses = require('../models/expenses');
let ExpensesCategory = require('../models/expenses_category');

router.get('/', function(req, res, next){
  ExpensesCategory.find({},(err,expenseC)=>{
    Expenses.find({},(err,expense)=>{
      res.render('pages/expenses/index',{
        expense: expense,
        expenseC: expenseC
      });
    });
  });
});

//Load Add Expense
router.get('/add', function(req, res){
  ExpensesCategory.find({},function(err, expense){
    res.render('pages/expenses/add',{
      expense: expense
    });
  });
});

//Add Attribute Post Route
router.post('/add', function(req,res){
  req.checkBody('amount','Amount is required').notEmpty();

  //Get Errors
  let errors = req.validationErrors();

  if (errors) {
    res.render('pages/settings/index',{
      errors: errors
    });
  } else {
    let expense= new Expenses();
    expense.category = req.body.category;
    expense.amount = req.body.amount;
    expense.user = req.user.id;

    expense.save(function(err){
      if(err){
        req.flash('danger','expense not added');
        console.log(err);
        return;
      } else{
        req.flash('success','expense added');
        res.redirect('/expenses');
      }
    });
  }
});

module.exports = router;
