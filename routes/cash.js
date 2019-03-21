const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const moment = require('moment')

const today = moment().startOf('day')
const tomorrow = moment(today).endOf('day')
var date = new Date(), y = date.getFullYear(), m = date.getMonth();
var firstLDay = new Date(y, m-1, 1);
var firstDay = new Date(y, m, 1);
var lastDay = new Date(y, m + 1, 0);
firstDay = moment(firstDay).format("DD-MM-YYYY");
firstLDay = moment(firstLDay).format("YYYY-MM-DD");
lastDay = moment(lastDay).format("YYYY-MM-DD");

let User = require('../models/user');
let Blog = require('../models/blog');
let Client = require('../models/client');
let Sale = require('../models/sale');
let Vendor = require('../models/vendor');
let Products = require('../models/products');
let SaleImei = require('../models/sale_imei');
let SaleProducts = require('../models/sale_products');
let SaleStatus = require('../models/sale_status');
let CollectedProductsVendor = require('../models/collected_product_vendor');
let CollectedProductsVendorInfo = require('../models/collected_product_vendor_info');
let Expenses = require('../models/expenses');
let ExpensesCategory = require('../models/expenses_category');
let PaymentVendor = require('../models/payment_vendor');
let PaymentVendorImei = require('../models/payment_vendor_imei');

function uniq_fast(a) {
  var seen = {};
  var out = [];
  var len = a.length;
  var j = 0;
  for(var i = 0; i < len; i++) {
       var item = a[i];    
       if(seen[item.collected.vendor] !== 1) {
             seen[item.collected.vendor] = 1;
             out[j++] = item;
       }
  }
  return out;
}

router.get('/', function(req, res, next){
  CollectedProductsVendorInfo
  .find({status : 'Closed',pay:0})
  .populate({path:'collected',select:'vendor cost',model:CollectedProductsVendor,
  populate:{path:'vendor',select:'name',model: Vendor}
})
  .exec((err,imei)=>{
    var imeiT= uniq_fast(imei);
    
  Expenses.find({
//     created_at: {
//    $gte: firstLDay,
//    $lt: lastDay
//  }
},function(err, expense){
    Sale.find({
    //    created_at: {
    //   $gte: firstLDay,
    //   $lt: lastDay
    // },
    status: "Closed"},function(err, sale){
      let saleArr = [];
      let saleCArr = 0;
      let saleIdArr = [];
      if (err) {
        console.log(err);
      }
      if (sale) { 
        sale.forEach(s => {
          saleArr.push(s);
          saleIdArr.push(s.id);
          saleCArr = saleCArr+1;
        });
      }
    
      SaleProducts.find()
      .where('sale')
      .in(saleIdArr)
      .exec(function (err, salep) {
        let salePArr = [];
        let cost = 0;
        let price = 0;
        if (err) {
          console.log(err);
        }
        if(salep){
          salep.forEach(s => {
            price = price + (s.price*s.qty);
            cost = cost + (s.cost*s.qty);
          });
        }
        res.render('pages/cash/index',{
          sale:saleArr,
          salep: salep,
          cost:cost,
          price: price,
          saleCArr:saleCArr,
          expense: expense,
          imei: imei,
          imeiT: imeiT
        });
      });
    });
});
});
});

router.get('/vendor/:id', function(req, res, next){
  Vendor.findById(req.params.id).exec((err,vendor)=>{
    CollectedProductsVendorInfo
    .find({status : 'Closed',pay: 0})
    .populate({path:'collected',select:'vendor cost product',model:CollectedProductsVendor
    ,populate:{path:'product',select:'title',model: Products}
  })
    .exec((err,imei)=>{
      let imeiArr = [];
      if (err) {
        return res.status(500).send({message: err.message});
      } 
      if (imei) { 
        imei.forEach(i => {
          if (i.collected.vendor == vendor.id) {
            imeiArr.push(i);
          }
          
        });
      }
      
      res.render('pages/cash/vendor',{
        vendor: vendor,
        imei: imeiArr
      });
    });
  });
})

//Make Payment
router.post('/vendor-pay/:id', function(req,res){
  
  req.checkBody('mode_pay','Mode Of Pay is required').notEmpty();  
   req.asyncValidationErrors().then(() => {
     var id=req.params.id;
         let pay= new PaymentVendor();
          pay.vendor = id;
          pay.discount = req.body.discount;
          pay.amount = req.body.amount_h;
          pay.note = req.body.note;
          pay.mode_pay = req.body.mode_pay;
          pay.save(function(err, new_pay){
          if(err){
            req.flash('danger','Payment not added');
            console.log(err);
            return;
          } else {
            let payId = new_pay._id;
            let product =req.body.product;    
                 
            for (var i = 0; i < product.length; i++) {
              let pp =  product[i]
              let payI= new PaymentVendorImei();
              payI.payment = payId;
              payI.collected =pp;
              
              payI.save((err)=>{
                if (err) {
                  req.flash('danger','Payment not added.');
                  console.log(err);
                  return;
                } else {
                  CollectedProductsVendorInfo.updateMany({ _id:pp },{ $set:{ pay: 1 }}, { multi: true }).exec((err,cep)=>{
                    if (err) {
                      req.flash('danger','Payment not added.');
                      console.log(err);
                      return;
                    }
                  });
                }
              })
            }
            req.flash('success','Payment added');
            res.redirect('/cash/');
          }
        });

      
    }).catch((errors) => {
        if(errors) {
          for (var i = 0; i < errors.length; i++) {
            var param = errors[i].param;
            var msg = errors[i].msg;
            req.flash('danger', errors[i].msg);
          }
          res.redirect('/cash/vendor/'+req.params.id);
          return;
        };
    });
});
module.exports = router;
