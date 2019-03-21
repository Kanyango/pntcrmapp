const express = require('express');
const router = express.Router();

let User = require('../models/user');
let Sale = require('../models/sale');
let Vendor = require('../models/vendor');
let Products = require('../models/products');
let SaleProducts = require('../models/sale_products');
let PaymentClient = require('../models/payment_client');
let ProductsVendor = require('../models/products_vendor');
let CollectedProductsVendor = require('../models/collected_product_vendor');
let CollectedProductsVendorInfo = require('../models/collected_product_vendor_info');

router.get('/client_search/:id', function(req, res, next){
  var reg=new RegExp(req.params.id, 'i');
  Sale.distinct('phone',{phone: reg},function(err, phone){
      res.render('pages/ajax/h_client_search',{
        phone: phone
      });
  });
});

router.get('/client_data/:id', function(req, res, next){
  Sale.find({phone:req.params.id},(err,sale)=>{
    SaleProducts.find({},(err, sprod)=>{
      Products.find({},(err, product)=>{
        res.render('pages/home/client_data',{
          sale: sale,
          sprod: sprod,
          product: product
        });
      })
    });
  }).limit(1);
});

//Imei Clients
router.get('/imei_search/:id',function(req, res,next){
  //var regex = new RegExp(req.query["term"], 'i');
  var reg=new RegExp(req.params.id, 'i');
  CollectedProductsVendorInfo.find({imei: reg},function(err, imei){
    res.render('pages/ajax/imei_search',{
      imei: imei
    });
  });
});

//Products
router.get('/products_search/:id',function(req, res,next){
  //var regex = new RegExp(req.query["term"], 'i');
  var reg=new RegExp(req.params.id, 'i');
  console.log(reg);
  Products.find({title: reg},function(err, products){
    ProductsVendor.find({},(err,pvendor)=>{
      Vendor.find({}, function(err, vendor){
        res.render('pages/ajax/products_search',{
          products: products,
          pvendor: pvendor,
          vendor: vendor
        });
      });
    });
  });
});

module.exports = router;
