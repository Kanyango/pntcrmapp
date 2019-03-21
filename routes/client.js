const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();

let User = require('../models/user');
let Client = require('../models/client');
let Sale = require('../models/sale');
let Repair = require('../models/repair');
let RepairProducts = require('../models/repair_products');
let Inquiry = require('../models/inquiry');
let Vendor = require('../models/vendor');
let Products = require('../models/products');
let SaleProducts = require('../models/sale_products');
let PaymentClient = require('../models/payment_client');
let ProductsVendor = require('../models/products_vendor');
let CollectedProductsVendor = require('../models/collected_product_vendor');
let CollectedProductsVendorInfo = require('../models/collected_product_vendor_info');

router.get('/', function(req, res, next){
  Client.find({},function(err, client){
    res.render('pages/client/index',{
      client:client
    });
  });
});

//CREATE NEW Client
router.get('/add', function(req, res, next){
    res.render('pages/client/add');
});

//SAVE NEW Client
router.post('/add',(req, res)=>{
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let phone = req.body.phone;
  let email = req.body.email;
  let location = req.body.location;
  let company = req.body.company;

  // Validation
  req.checkBody('first_name', 'Firstname is required').notEmpty();
  req.checkBody('last_name', 'Last Name is Required').notEmpty();
  req.checkBody('email', 'Email is not Valid').isEmail();
  req.checkBody('phone', 'Phone is required').notEmpty();

  req.asyncValidationErrors().then(() => {
    //no errors, create user
    let client= new Client();
    client.first_name = first_name;
    client.last_name = last_name;
    client.phone = phone;
    client.email = email;
    client.location = location;
    client.company = company;

    client.save(function(err){
      if(err){
        req.flash('danger','Client not Create');
        res.redirect('/client/add');
        console.log(err);
        return;
      }

        req.flash('success','Client Created');
        res.redirect('/client');
    });

  }).catch((errors) => {

      if(errors) {
        for (var i = 0; i < errors.length; i++) {
          var param = errors[i].param;
          var msg = errors[i].msg;
          req.flash('danger', errors[i].msg);
        }
        res.redirect('/client/add');
        return;
      };
  });

  //
  //
  //
});

//Client View FROM ID
router.get('/view/:id', function(req, res, next){
  Client.findById(req.params.id,function(err, client){
    SaleProducts.find({},function(err, sale_products){
      Sale.find({client:req.params.id},function(err, sale){
        Repair.find({client:req.params.id},function(err, repair){
          RepairProducts.find({},function(err, repairP){
            Inquiry.find({client:req.params.id},(err, inquiry)=>{
              Products.find({}, function(err, products){
                ProductsVendor.find({},function(err, pvendor){
                  Vendor.find({},function(err, vendor){
                    PaymentClient.find({}, (err, payment)=>{
                      res.render('pages/client/view',{
                        client:client,
                        products: products,
                        saleProd: sale_products,
                        sale: sale,
                        repair: repair,
                        repairP: repairP,
                        inquiry: inquiry,
                        pvendor:pvendor,
                        vendor: vendor,
                        payment: payment
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

//Edit Client
router.get('/edit/:id', (req,res,next)=>{
  Client.findById(req.params.id,function(err, client){
    res.render('pages/client/edit',{
      client: client
    });
  });
});

//Update Client info
router.post('/edit/:id', (req, res) => {

     let first_name =req.body.first_name;
     let last_name =req.body.last_name;
     let phone =req.body.phone;
     let email = req.body.email;
     let location = req.body.location;
     let company = req.body.company;

      Client.updateMany({ _id:req.params.id },{ $set:{ first_name: first_name , last_name: last_name , phone: phone, email: email,location:location,company:company }}, { multi: true }).exec();
         res.redirect('/client/view/'+req.params.id);
});

////////////////////////////////
////////AJax Functions/////////
///////////////////////////////

//Search Clients
router.get('/client_search/:id',function(req, res,next){
  //var regex = new RegExp(req.query["term"], 'i');
  var reg=new RegExp(req.params.id, 'i');
  Client.find({ $or: [ { first_name: reg }, { last_name: reg }, { phone: reg } ] },function(err, client){
    res.render('pages/ajax/client_search',{
      client: client
    });
  });
});

//Search Clients Homepage
router.get('/h_client_search/:id',function(req, res,next){
  var search = req.params.id;
  var reg=new RegExp(search, 'i');
  // if (Number.isInteger(search)){
  //   Client.find({phone: reg},function(err, client){
  //     res.render('pages/ajax/h_client_search',{
  //       client: client
  //     });
  //   });
  // } else{
    Client.find( { $or: [ { first_name: reg }, { last_name: reg }, { phone: reg } ] } ,function(err, client){
      res.render('pages/ajax/h_client_search',{
        client: client
      });
    });
  //}
});

//Search Clients From Sale Records
router.get('/client_data/:id',function(req, res,next){
  Client.findById({_id:req.params.id},(err,client)=>{
    res.render('pages/ajax/client_data',{
      client: client
    });
  });
});

//Search Clients From Sale Records
router.get('/client_data_products/:id',function(req, res,next){
  Client.findById({_id:req.params.id},(err,client)=>{
    Sale.find({client:client.id,status: 'Closed'},(err,sale)=>{
      SaleProducts.find({},(err,saleP)=>{
        CollectedProductsVendor.find({},(err,colV)=>{
          CollectedProductsVendorInfo.find({},(err,colP)=>{
            Products.find({},(err,products)=>{
              Vendor.find({},(err,vendor)=>{
                res.render('pages/ajax/client_data_products',{
                  client: client,
                  sale: sale,
                  saleP: saleP,
                  colV: colV,
                  colP: colP,
                  products: products,
                  vendor: vendor
                });
              });
            });
          });
        });
      });
    });
  });
});

//Search Clients From Sale Records
router.get('/imei_repair/:id',function(req, res,next){
  CollectedProductsVendorInfo.findById({_id:req.params.id},(err,colP)=>{
    Sale.find({},(err,sale)=>{
      SaleProducts.find({},(err,saleP)=>{
        CollectedProductsVendor.find({},(err,colV)=>{
          Client.find({},(err,client)=>{
            Products.find({},(err,products)=>{
              Vendor.find({},(err,vendor)=>{
                res.render('pages/ajax/imei_data_repair',{
                  client: client,
                  sale: sale,
                  saleP: saleP,
                  colV: colV,
                  colP: colP,
                  products: products,
                  vendor: vendor
                });
              });
            });
          });
        });
      });
    });
  });
});

module.exports = router;
