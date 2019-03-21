const express = require('express');
const router = express.Router();

let Expenses = require('../models/expenses');
let ExpensesCategory = require('../models/expenses_category');
let User = require('../models/user');
let Sale = require('../models/sale');
let Vendor = require('../models/vendor');
let Products = require('../models/products');
let ProductBrand = require('../models/product_brand');
let SaleImei = require('../models/sale_imei');
let SaleProducts = require('../models/sale_products');
let PaymentVendor = require('../models/payment_vendor');
let PaymentVendorImei = require('../models/payment_vendor_imei');
let ProductsVendor = require('../models/products_vendor');
let CollectedProductsVendor = require('../models/collected_product_vendor');
let CollectedProductsVendorInfo = require('../models/collected_product_vendor_info');
let Reminder = require('../models/reminder');
let ReminderInquiry = require('../models/reminder_inquiry');
let ReminderRepair = require('../models/reminder_repair');

router.get('/', function(req, res, next){
  Sale.find({},(err,sale)=>{
    SaleProducts.find({},(err,sproduct)=>{
      SaleImei.find({},(err,imei)=>{
        Vendor.find({},(err,vendor)=>{
          Reminder.find({},(err,reminder)=>{
            ReminderInquiry.find({},(err,reminderI)=>{
              ReminderRepair.find({},(err,reminderR)=>{
                CollectedProductsVendor.find({},(err,cproducts)=>{
                  CollectedProductsVendorInfo.find({},(err,cinfo)=>{
                    PaymentVendor.find({},(err,payment)=>{
                      PaymentVendorImei.find({},(err,paymenti)=>{
                        ExpensesCategory.find({},(err,expenseC)=>{
                          Expenses.find({},(err,expense)=>{
                            Products.find({},(err,product)=>{
                              res.render('pages/index',{
                                sale: sale,
                                vendor: vendor,
                                cproducts: cproducts,
                                cinfo: cinfo,
                                payment: payment,
                                paymenti: paymenti,
                                expenseC: expenseC,
                                expense: expense,
                                sproduct: sproduct,
                                imei: imei,
                                product: product,
                                reminder: reminder,
                                reminderI: reminderI,
                                reminderR: reminderR
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

//login Form
router.get('/login', function(req, res){
  res.render('pages/users/login');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/login');
	}
}

module.exports = router;
