const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const  config = require('../config/database');

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

let UserWeb = require('../models/user_web');
let Products = require('../models/products');
let Vendor = require('../models/vendor');
let Blog = require('../models/blog');
let ProductsVendor = require('../models/products_vendor');
let Category = require('../models/product_category');
let Attributes = require('../models/product_attributes');
let Entities = require('../models/product_entities');
let Brand = require('../models/product_brand');
let AttribEntities = require('../models/product_attributesEntities');
let ProductEntities = require('../models/product_entities_val');
let PhoneProductsFeatured = require('../models/phone_products_featured');
let PhoneMainCategory = require('../models/phone_main_category');
let CourierLocation = require('../models/courier_location');
let Courier = require('../models/courier');
let PhoneMainSlider = require('../models/phone_main_slider');
let Tags = require('../models/product_tags');
let User = require('../models/user');
let Client = require('../models/client');
let Sale = require('../models/sale');
let SaleImei = require('../models/sale_imei');
let SaleProducts = require('../models/sale_products');
let SaleStatus = require('../models/sale_status');
let PaymentClient = require('../models/payment_client');
let CollectedProductsVendor = require('../models/collected_product_vendor');
let CollectedProductsVendorInfo = require('../models/collected_product_vendor_info');
let DeliveryLocation = require('../models/delivery_locations');
let SaleCourier = require('../models/sale_courier');
let SaleWebConn = require('../models/sale_web_conn');
let PhoneMainShipping = require('../models/phone_main_shipping');
let SaleWeb = require('../models/sale_web');
let SaleWebContactSeller = require('../models/sale_web_contact_seller');

//Sale Store All
router.get('/sale', function(req, res, next){
  Sale.
  find({}).
  populate('client','first_name last_name phone',Client).
  sort({created_at: 'desc'}).
  exec((err, sale)=>{
    let saleArr = [];
    if (err) {
      return res.status(500).send({message: err.message});
    }
    if (sale) {
      sale.forEach(s => {
        saleArr.push(s);
      });
    }
    res.send(saleArr);
  });
});

//Sale Web All
router.get('/sale/sale-web', function(req, res, next){
  SaleWeb.
  find({}).
  populate('cart.productId','title',Products).
  sort({created_at: 'desc'}).
  exec((err, sale)=>{
    let saleArr = [];
    if (err) {
      return res.status(500).send({message: err.message});
    }
    if (sale) {
      sale.forEach(s => {
        saleArr.push(s);
      });
    }
    res.send(saleArr);
  });
});

//CREATE NEW SALE
router.get('/sale/add', function(req, res, next){
  CollectedProductsVendorInfo
  .find({status:'Collected'})
  .populate('collected','vendor product',CollectedProductsVendor)
  .exec((err, cprod)=>{
    let colArr = [];
    if (err) {
      return res.status(500).send({message: err.message});
    }
    if (cprod) {
      cprod.forEach(s => {
        colArr.push(s);
      });
    }
    var col = {};
    var distinct = [];
    colArr.forEach(function (x) {
      if (!col[x.collected]) {
        distinct.push(x.collected);
        col[x.collected] = true;
      }
    });
    // var col = [];
    // var distinct = [];
    // for( var i in colArr ){
    // if( typeof(col[colArr[i].collected]) == "undefined"){
    //   distinct.push(colArr[i].collected);
    // }
    // col[colArr[i].collected] = 0;
    // }
      res.send({colArr, distinct})
  });
});

module.exports = router;
