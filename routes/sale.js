const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

let Category = require('../models/product_category');
let Brand = require('../models/product_brand');
let User = require('../models/user');
let Client = require('../models/client');
let Sale = require('../models/sale');
let Vendor = require('../models/vendor');
let Products = require('../models/products');
let SaleImei = require('../models/sale_imei');
let SaleProducts = require('../models/sale_products');
let SaleStatus = require('../models/sale_status');
let PaymentClient = require('../models/payment_client');
let ProductsVendor = require('../models/products_vendor');
let CollectedProductsVendor = require('../models/collected_product_vendor');
let CollectedProductsVendorInfo = require('../models/collected_product_vendor_info');
let Courier = require('../models/courier');
let CourierLocation = require('../models/courier_location');
let DeliveryLocation = require('../models/delivery_locations');
let SaleCourier = require('../models/sale_courier');
let SaleWeb = require('../models/sale_web');
let SaleWebConn = require('../models/sale_web_conn');
let SaleWebContactSeller = require('../models/sale_web_contact_seller');
let PhoneMainShipping = require('../models/phone_main_shipping');



router.get('/', function(req, res, next){
  Sale.find({}).
  populate('client','first_name last_name',Client).
  exec((err, sale)=>{
    SaleProducts.find({},function(err, sale_products){
      Products.find({},function(err, products){
        PaymentClient.find({},(err,payment)=>{
          Client.find({},(err,client)=>{
            CollectedProductsVendor.find({},(err,colProd)=>{
              //SaleWeb.find({},(err,saleWeb)=>{
              SaleWeb
              .find({status:'raw'})
              .populate('shipping','location amount',PhoneMainShipping)
              .exec((err,saleWeb)=>{
                SaleWebContactSeller.find({},(err,saleCont)=>{
                  res.render('pages/sale/index',{
                    sale: sale,
                    saleProd:sale_products,
                    products: products,
                    payment: payment,
                    client: client,
                    colProd: colProd,
                    saleWeb: saleWeb,
                    saleCont: saleCont
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

router.get('/sale_web', function(req, res, next){
  SaleWeb
  .find({})
  .populate('shipping','location amount',PhoneMainShipping)
  .exec((err,saleWeb)=>{   
      res.render('pages/sale/sale_web',{
        saleWeb: saleWeb
      });
    });
});

//Update Sale Status
router.post('/sale_status/:id', (req, res) => {

     let query = {_id: req.params.id};
     let new_status =req.body.status;

      Sale.update(query,{ status: new_status}).exec();
      let status = new SaleStatus();
      status.sale = req.params.id;
      status.status = new_status;
      status.save(function(err){});

      SaleProducts.find({sale:req.params.id},(err, sale)=>{
        SaleImei.find({},(err, saleImei)=>{
        CollectedProductsVendorInfo.find({},(err, collected)=>{
          for (var s = 0; s < sale.length; s++) {
          for (var i = 0; i < saleImei.length; i++) {
            if (saleImei[i].sale == sale[s].id) {
              for (var c = 0; c < collected.length; c++) {
                if (saleImei[i].imei == collected[c].id) {
                  if (new_status == 'Cancelled') {
                    SaleImei.remove({ _id:saleImei[i].id }, function (err) {
                      CollectedProductsVendorInfo.updateMany({ _id: collected[c].id },{ $set:{ status: 'Collected' }}, { multi: true }).exec();
                    });
                  } else {
                    CollectedProductsVendorInfo.update({_id:collected[c].id},{ status: new_status}).exec();
                  }

                }
              }
            }
            }

          }
        });
      });
      });
        res.send(new_status);
});

router.get('/sale_web_view/:id', function(req, res, next){
  CollectedProductsVendor
  .find({})
  .populate('product','title',Products) 
  .populate('vendor','name',Vendor)
  .exec((err,coll)=>{
  Client.find({},(err,client)=>{
    SaleWeb
    .findById(req.params.id)
    .populate('shipping','location amount',PhoneMainShipping)
    .exec((err,saleWeb)=>{
      let ProdArr=[];
      saleWeb.cart.forEach(ct => {
        ProdArr.push(ct.productId);
      });
      Products
        .find()
        .select('title')
        .where('_id')
        .in(ProdArr)
        .exec(function (err, prod) {
          DeliveryLocation
          .findById(saleWeb.shipping.location)
          .exec((err,location)=>{
            res.render('pages/sale/sale_web_view',{
              client: client,
              saleWeb: saleWeb,
              prod: prod,
              location: location,
              coll: coll
            });
          });
        });
    });
  });
  });
});

router.get('/sale_web_contact', function(req, res, next){
  SaleWebContactSeller.find({},(err,saleWeb)=>{
    res.render('pages/sale/sale_web_contact',{
      saleWeb: saleWeb
    });
  });
});

router.get('/sale_web_contact_view/:id', function(req, res, next){
  SaleWebContactSeller.
  findById(req.params.id).
  populate('product','title price special_price images',Products).
  exec((err,saleWeb)=>{
        res.render('pages/sale/sale_web_contact_view',{
          saleWeb: saleWeb
        });
  });
});

//CREATE NEW SALE
router.get('/add', function(req, res, next){
  CollectedProductsVendor
  .find({})
  .populate('product','title price cost',Products)
  .populate('vendor','name',Vendor)
  .exec((err, cven)=>{
    CollectedProductsVendorInfo.find({},(err, cprod)=>{
      res.render('pages/sale/add',{
        cprod: cprod,
        cven: cven
      });
    });
  });
});

//SAVE NEW Client
router.post('/add_client',(req, res)=>{
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let phone = req.body.phone;
  let email = req.body.email;

  // Validation
  req.checkBody('first_name', 'Firstname is required').notEmpty();
  req.checkBody('last_name', 'Last Name is Required').notEmpty();
  req.checkBody('phone', 'Phone is required').notEmpty();

  req.asyncValidationErrors().then(() => {
    //no errors, create user
    let client= new Client();
    client.first_name = first_name;
    client.last_name = last_name;
    client.phone = phone;
    client.email = email;

    client.save(function(err){
      if(err){
        req.flash('danger','Client not Create');
        res.redirect('/sale/add');
        console.log(err);
        return;
      }
        req.flash('success','Client Created');
        res.redirect('/sale/add');
    });

  }).catch((errors) => {

      if(errors) {
        for (var i = 0; i < errors.length; i++) {
          var param = errors[i].param;
          var msg = errors[i].msg;
          req.flash('danger', errors[i].msg);
        }
        res.redirect('/sale/add');
        return;
      };
  });

  //
  //
  //
});

//SAVE NEW SALE
router.post('/add', function(req, res){
  // Validation
  req.checkBody('id', 'Client is required').notEmpty();
  req.checkBody('prod', 'Products Not Selected').notEmpty();

  req.asyncValidationErrors().then(() => {    
    let sale= new Sale();
    sale.status = "Open";
    sale.user = req.user.id;
    sale.client = req.body.id;
      sale.save(function(err, new_sale){
        let saleId = new_sale._id;
        if(err){
          req.flash('danger','Sale not Create');
          console.log(err);
          return;
        } else{
          let status = new SaleStatus();
          status.sale = saleId;
          status.status = "Open";
          status.save(function(err){
            if (err) {
              console.log(err);
              return;
            }
          });

          let product =req.body.prod;          
          let price =req.body.price;
          let cost =req.body.cost;
          let imei = req.body.imei;
          let prod='a';
           for (var i = 0; i < product.length; i++) {   
             var proI = product[i]          
            let sale_prod= new SaleProducts();
               sale_prod.sale= saleId;
               sale_prod.product = product[i]; 
               sale_prod.qty = 1;
               sale_prod.price = price[i];
               sale_prod.cost = cost[i];
               sale_prod.save(function(err,new_prod){
                 if(err){
                   console.log(err);
                   return;
                 }
              let prodId = new_prod._id;
              imei.forEach(element=> {
                var ime = element[proI];
                
                if (Array.isArray(ime)) {                
                  for (var i = 0; i < ime.length; i++) {
                    let saleI = new SaleImei();
                    saleI.sale=prodId;
                    saleI.imei=ime[i];
                    CollectedProductsVendorInfo.update({_id:ime[i]},{ status: "On hold"}).exec();
                     saleI.save(function(err){
                       if (err) {
                        console.log(err);
                        return;
                       } else{
                         console.log('saved');
                       }
                      });
                   }
                } else {
                  let saleI = new SaleImei();
                    saleI.sale=prodId;
                    saleI.imei=ime;
                    CollectedProductsVendorInfo.update({_id:ime},{ status: "On hold"}).exec();
                     saleI.save(function(err){
                      if (err) {
                        console.log(err);
                        return;
                       } else{
                         console.log('saved2');
                       }
                      });
                }
                
              });
                });

          }

          req.flash('success','Sale Created');
          res.redirect('/sale/view/'+saleId);
        }
     });
    
  }).catch((errors) => {

      if(errors) {
        for (var i = 0; i < errors.length; i++) {
          var param = errors[i].param;
          var msg = errors[i].msg;
          req.flash('danger', errors[i].msg);
        }
        console.log(errors);
        
        //res.redirect('/sale/add');
        return; 
      };
  });
});

//SAVE NEW WEB SALE
router.post('/add_web', function(req, res){
    let sale= new Sale();
    
    sale.status = "Open";
    sale.user = "59f70f6d6fc64430a7e08a67";//req.user.id;
    Client.findOne({phone:req.body.phone}, function( err, cInfo){
      if (cInfo) {
        sale.client = cInfo.id;
        sale.save(function(err, new_sale){
          let saleId = new_sale._id;
          if(err){
            req.flash('danger','Sale not Create');
            console.log(err);
            return;
          } else{
            SaleWeb.update({_id:req.body.web_id},{ status: "Confirmed"}).exec();
  
            let status = new SaleStatus();
            status.sale = saleId;
            status.status = "Open";
            status.save(function(err){
              if (err) {
                console.log(err);
                return;
              }
            });
            
            let saleWebConn = new SaleWebConn();
            saleWebConn.sale = saleId;
            saleWebConn.web = req.body.web_id;
            saleWebConn.save(function(err){
              console.log(err);
              return;
            });
  
            let product =req.body.prod;
            let price =req.body.price;
            let cost =req.body.cost;
            let qty =req.body.qty;
            let prod='a';
            for (var i = 0; i < product.length; i++) {
              let sale_prod= new SaleProducts();
                 sale_prod.sale= saleId;
                 sale_prod.product = product[i];
                 sale_prod.qty = qty[i];
                 sale_prod.price = price[i];
                 sale_prod.cost = cost[i];
                 sale_prod.save(function(err){
                   if(err){
                     console.log(err);
                     return;
                   }
                 });
            }
  
            req.flash('success','Sale Created');
            res.redirect('/sale/view/'+saleId);
          }
        });
      } else {
        let client = new Client();

        client.first_name = req.body.first_name;
        client.last_name = req.body.last_name;
        client.phone = req.body.phone;
        client.email = req.body.email;
        client.save(function(err, new_client){
          if (err) {
            console.log(err);
            return;
          }
          sale.client = new_client._id;
          sale.save(function(err, new_sale){
            let saleId = new_sale._id;
            if(err){
              req.flash('danger','Sale not Create');
              console.log(err);
              return;
            } else{
              SaleWeb.update({_id:req.body.web_id},{ status: "Confirmed"}).exec();
  
              let status = new SaleStatus();
              status.sale = saleId;
              status.status = "Open";
              status.save(function(err){
                console.log(err);
                return;
              });
  
              let saleWebConn = new SaleWebConn();
              saleWebConn.sale = saleId;
              saleWebConn.web = req.body.web_id;
              saleWebConn.save(function(err){
                console.log(err);
                return;
              });
  
              let product =req.body.prod;
              let price =req.body.price;
              let cost =req.body.cost;
              let qty =req.body.qty;
              let prod='a';
              for (var i = 0; i < product.length; i++) {
                let sale_prod= new SaleProducts();
                   sale_prod.sale= saleId;
                   sale_prod.product = product[i];
                   sale_prod.qty = qty[i];
                   sale_prod.price = price[i];
                   sale_prod.cost = cost[i];
                   sale_prod.save(function(err){
                     if(err){
                       console.log(err);
                       return;
                     }
                   });
              }
  
              req.flash('success','Sale Created');
              res.redirect('/sale/view/'+saleId);
            }
          });
        });
      }
    })
    // if(req.body.client_id){
    //   sale.client = req.body.client_id;
      
    // }else{
      
    // }
});

//Sale View FROM ID
router.get('/view/:id', function(req, res, next){
  Sale.  findById(req.params.id).
  populate('client','first_name last_name email phone',Client).
  exec((err, sale)=>{
    SaleStatus.find({sale:req.params.id},function(err, status){
      SaleProducts.find({sale:req.params.id}).
      populate({path:'product',select:'product vendor', model: CollectedProductsVendor
      ,populate:{path:'product',select:'title',model: Products}
    }).
      exec((err, sale_products)=>{
        //Products.find({}, function(err, products){
          //  Vendor.find({},function(err, vendor){
              PaymentClient.find({}, (err, payment)=>{
                CollectedProductsVendorInfo.find({},(err, cprod)=>{
                CollectedProductsVendor.
                find({}).
                populate('product','title price',Products).
                populate('vendor','name',Vendor).
                exec((err,col)=>{
                  SaleImei.find({},(err,imei)=>{
                    Courier.find({},function(err, courier){
                      CourierLocation.find({},(err,location)=>{
                        DeliveryLocation.find({},(err,dLoc)=>{
                          SaleCourier.find({},(err,sCourier)=>{
                            SaleWebConn.findOne({sale:req.params.id},(err,saleConn)=>{
                              SaleWeb
                              .find({})
                              .populate('shipping','location amount',PhoneMainShipping)
                              .exec((err,saleWeb)=>{
                                res.render('pages/sale/view',{ 
                                  //products: products,
                                  saleProd: sale_products,
                                  sale: sale,
                                 // vendor: vendor,
                                  payment: payment,
                                  status: status,
                                  col: col,
                                  cprod: cprod,
                                  imei: imei,
                                  courier: courier,
                                  location: location,
                                  dLoc: dLoc,
                                  sCourier: sCourier,
                                  saleWeb: saleWeb,
                                  saleConn: saleConn,
                                  user: req.user
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  })
                });
              });
            });
          //  });
        //});
      });
    });
  });
});

//Get Courier Fields
router.get('/sale-courier/:id/:location', function(req, res, next){
  Courier.find({},function(err, courier){
    CourierLocation.find({},(err,loc)=>{
      DeliveryLocation.find({},(err,dLoc)=>{
        res.render('pages/sale/sale-courier',{
          courier: courier,
          location: req.params.location,
          id: req.params.id,
          loc: loc,
          dLoc: dLoc
        });
      })
    });
  });
});

//Update Product IMEI
router.post('/add-shipped/:id', (req, res) => {
  let sale = req.params.id;
  let location = req.body.courier;
  let waybill = req.body.waybill;
  let payment = req.body.payment;

    CourierLocation.findById(location,(err,loc)=>{
        let ship = new SaleCourier();
        ship.sale = sale;
        ship.courier = location;
        ship.waybill = waybill;
        ship.payment_status = payment;
        ship.payment_amount = loc.amount;
        ship.save(function(err){
          if(err){
            req.flash('danger','SHip not Create');
            res.redirect('/sale/view'+sale);
            console.log(err);
            return;
          }
        });
    });

  res.redirect('/sale/view/'+sale);
  req.flash('success','Ship Info Added');
});

//Add Product 
router.post('/add-product/:id', (req, res) => {
  let sale = req.params.id;
  let product =req.body.prod;
  let price = Number(req.body.price);
  let cost = Number(req.body.cost);

   for (var i = 0; i < product.length; i++) {
      let sale_prod= new SaleProducts();
          sale_prod.sale= sale;
          sale_prod.product = product[i];
          sale_prod.qty = 1;
          sale_prod.price = price;
          sale_prod.cost = cost;
          sale_prod.save(function(err){
            if(err){
              console.log(err);
            }
          });
   }

  req.flash('success','Product Added On Sale');
  res.redirect('/sale/view/'+sale);
});

//Sale View FROM ID PDF Report
router.get('/view/:id/pdf', function(req, res, next){
  Sale.findById(req.params.id,function(err, sale){
    SaleStatus.find({sale:req.params.id},function(err, status){
    Client.find({},function(err, client){
      SaleProducts.find({sale:req.params.id},function(err, sale_products){
        Products.find({}, function(err, products){
          ProductsVendor.find({},function(err, pvendor){
            Vendor.find({},function(err, vendor){
              PaymentClient.find({}, (err, payment)=>{
                CollectedProductsVendor.find({},(err,col)=>{
                  SaleImei.find({},(err,imei)=>{
                    res.render('pages/sale/pdf',{
                      products: products,
                      client:client,
                      saleProd: sale_products,
                      sale: sale,
                      pvendor:pvendor,
                      vendor: vendor,
                      payment: payment,
                      status: status,
                      col: col,
                      imei: imei
                    });
                  })
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

router.get('/view/:id/cashsale', function(req, res, next){
  Sale.findById(req.params.id,function(err, sale){
    SaleStatus.find({sale:req.params.id},function(err, status){
    Client.find({},function(err, client){
      SaleProducts.find({sale:req.params.id}).
      populate({path:'product',select:'product vendor', model: CollectedProductsVendor
      ,populate:{path:'product',select:'title',model: Products}
    }).exec((err, sale_products)=>{
          ProductsVendor.find({},function(err, pvendor){
            Vendor.find({},function(err, vendor){
              PaymentClient.find({}, (err, payment)=>{
                CollectedProductsVendor.find({},(err,col)=>{
                  SaleImei.find({},(err,imei)=>{
                    res.render('pages/sale/sale_cashsale',{
                      client:client,
                      saleProd: sale_products,
                      sale: sale,
                      pvendor:pvendor,
                      vendor: vendor,
                      payment: payment,
                      status: status,
                      col: col,
                      imei: imei
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

router.get('/view/:id/invoice', function(req, res, next){
  Sale.findById(req.params.id,function(err, sale){
    Client.find({},function(err, client){
      SaleProducts.find({sale:req.params.id}).
      populate({path:'product',select:'product vendor', model: CollectedProductsVendor
      ,populate:{path:'product',select:'title',model: Products}
    }).exec((err, sale_products)=>{
              PaymentClient.find({}, (err, payment)=>{
                  SaleImei.find({},(err,imei)=>{
                    res.render('pages/sale/sale_invoice',{
                      client:client,
                      saleProd: sale_products,
                      sale: sale,
                      payment: payment,
                      imei: imei
                  })
          });
      });
    });
  });
  });
});

// Products Picked From Vendor
router.get('/collected_products', function(req, res, next){
  CollectedProductsVendor.find({},function(err, cproducts){
    CollectedProductsVendorInfo.find({},(err,cprodI)=>{
      Products.find({},function(err, products){
        ProductsVendor.find({},function(err, pvendor){
          Vendor.find({},function(err, vendor){
            User.find({},function(err, user){
              res.render('pages/sale/vendor/collected_products',{
                products: products,
                pvendor:pvendor,
                vendor: vendor,
                cproducts: cproducts,
                cprodI:cprodI,
                user: user
              });
            });
          });
        });
      });
    });
  });
});

//Add new Products To Collected List
router.get('/collected_new', (req,res,next)=>{
  Products.find({is_active:1,stock:1})
  .select('title price brand')
  .populate('brand','title',Brand)
  .exec((err, products)=>{
    ProductsVendor.find({},function(err, pvendor){
      Vendor.find({},function(err, vendor){
          User.find({},(err, user)=>{
            res.render('pages/sale/vendor/collected_new',{
              products: products,
              pvendor:pvendor,
              vendor: vendor,
              user: user
            });
          });
      });
    });
  });
});

//Save New Products Collected form Vendor
router.post('/collected_new', (req, res) => {
  // Validation
  req.checkBody('col_vendor', 'Please Select a Vender').notEmpty();
  req.checkBody('col_user', 'Please Select a Pick up User').notEmpty();
  req.checkBody('cost', 'Please Input Cost').notEmpty();
  req.checkBody('col', 'Please Select Product').notEmpty();

  req.asyncValidationErrors().then(() => {

    let col=req.body.col;
    let cos=req.body.cost;
    for (var i = 0; i < col.length; i++) {
      let coll = col[i];
      let coss = cos[i];
      let prod= new CollectedProductsVendor();
      prod.vendor = req.body.col_vendor;
      prod.col_user = req.body.col_user;
      prod.cost = coss;
      prod.user = req.user.id;
      prod.product = coll;
      prod.save(function(err, new_col){
        let colId = new_col._id;

        if(err){console.log(err);return;}

        let imei = req.body.imei[coll];
        if (imei) {
          for (var i = 0; i < imei.length; i++) {

            let col= new CollectedProductsVendorInfo();
              col.collected = colId;
              col.status = 'Collected';
              col.imei =imei[i];

              col.save(function(err){
               if(err){console.log(err);return;}
              });
          }
        } else {
          console.log('no imei');
          
        }

      });
    }
      //

  // let col=req.body.col;
  // for (var i = 0; i < col.length; i++) {
  //   console.log('col:'+col[i]);
  //   console.log('qty:'+ req.body.col_qty_+col[i]);
  // }
  req.flash('success','Product added');
  res.redirect('/sale/collected_products');
  }).catch((errors) => {
      if(errors) {
        for (var i = 0; i < errors.length; i++) {
          var param = errors[i].param;
          var msg = errors[i].msg;
          req.flash('danger', errors[i].msg);
        }
        res.redirect('/sale/collected_new');
        return;
      };
  });

});

//Add new IMEI
router.get('/assign_imei/:id', (req,res,next)=>{
  CollectedProductsVendor.findById(req.params.id,function(err, cproducts){
    Products.find({},function(err, products){
      Vendor.find({},function(err, vendor){
        User.find({},(err,user)=>{
          res.render('pages/sale/assign_imei',{
            products: products,
            cproducts: cproducts,
            vendor: vendor,
            user: user
          });
        });
      });
    });
  });
});

//Save New Product Imei of Collected from Vendor
router.post('/assign_imei/:id', (req, res) => {
  req.checkBody('product_id','Product is required').notEmpty();
  req.checkBody('vendor_id','Vendor is required').notEmpty();

  //Get Errors
  let errors = req.validationErrors();

  if (errors) {
    res.render('pages/sale/vendor/collected_products',{
      errors: errors
    });
    console.log(errors);
  } else {



     let imei=req.body.imei;

     for (var i = 0; i < imei.length; i++) {
       let prod= new CollectedProductsVendorInfo();
       CollectedProductsVendorInfo.find({imei : imei[i]}, function (err, imeiC) {
         if (!imeiC.length) {
          prod.collected = req.params.id;
          prod.status = 'Collected';
         prod.imei =imei[i];
         //console.log(prod);
         prod.save(function(err){
           if(err){console.log(err);return;}
         });
         }
       });
       
     }
        req.flash('success','IMEI added');
        res.redirect('/sale/collected_products');
  }
});

//View All Imei
router.get('/imei', (req,res,next)=>{
  CollectedProductsVendor.find({},function(err, cproducts){
    CollectedProductsVendorInfo.find({},(err, productsInfo)=>{
      Products.find({},function(err, products){
        Sale.find({},function(err, sale){
          SaleImei.find({},(err,Simei)=>{
            Vendor.find({},function(err, vendor){
              res.render('pages/sale/imei',{
                products: products,
                cproducts: cproducts,
                vendor: vendor,
                productsInfo: productsInfo,
                sale: sale,
                simei: Simei
              });
            });
          });
        });
      });
    });
  });
});

//View Imei Info
router.get('/imei/:id', (req,res,next)=>{
  CollectedProductsVendorInfo.findById(req.params.id,(err, productsInfo)=>{
    CollectedProductsVendor.
    findById(productsInfo.collected).
    populate('product','title',Products).
    populate('vendor','name phone',Vendor).
    exec((err, cproducts)=>{
      Products.find({},function(err, products){
        Sale.find({},function(err, sale){
          SaleImei.find({},(err,Simei)=>{
              res.render('pages/sale/imei_info',{
                products: products,
                cproducts: cproducts,
                productsInfo: productsInfo,
                sale: sale,
                simei: Simei
              });
          });
        });
      });
    });
  });
});

//View Vendor Product Info
router.get('/vendor_prod_info/:id', (req,res,next)=>{
  CollectedProductsVendor
  .findById(req.params.id)
  .populate('product','title',Products)
  .exec((err, cproducts)=>{
    CollectedProductsVendorInfo.find({collected:req.params.id},(err, productsInfo)=>{
    //  Products.find({},function(err, products){
        Vendor.find({},function(err, vendor){
          User.findById(cproducts.col_user,(err,user)=>{
            res.render('pages/sale/vendor/vendor_prod_info',{
              //products: products,
              cproducts: cproducts,
              vendor: vendor,
              productsInfo: productsInfo,
              user: user
            })
          });
        });
    //  });
    });
  });
});

//Update Product info Sale
router.post('/edit_prod_sale/:id', (req, res) => {

     let edit = {};
     let query = {_id: req.params.id};
     qty =req.body.qty;
     price =req.body.price;
     cost =req.body.cost;
    // console.log(req.params.id);
     let prod= new SaleProducts();
      // prod.update( query,{$set:edit},       function(err, results){
      //   if(err){
      //     console.log(err);return;
      //   } else{
      //     console.log(results);
      //   }
      // });

      SaleProducts.updateMany({ _id:req.params.id },{ $set:{ qty: qty , price: price , cost: cost }}, { multi: true }).exec();
         res.redirect('/sale/view/'+req.body.id);
});

//Update Product IMEI
router.post('/add_imei/:id', (req, res) => {
let imei = req.body.imei;

for (var i = 0; i < imei.length; i++) {
  let sale = new SaleImei();
  sale.sale=req.params.id;
  sale.imei=imei[i];
  CollectedProductsVendorInfo.updateMany({ _id:imei[i] },{ $set:{ status: 'On hold' }}, { multi: true }).exec();
  sale.save(function(err){
     if(err){console.log(err);return;}
   });
}
         res.redirect('/sale/view/'+req.body.id);
});

//Save Sale Payment
router.post('/sale_payment/:id', (req, res) => {
   
    let cash = Number(req.body.cash);
    let mpesa = Number(req.body.mpesa);
    let mpesa_id = req.body.mpesa_id;
    let cheque = Number(req.body.cheque);
    let cheque_id = req.body.cheque_id;
    let card = Number(req.body.card);
    let amount = Number(card + cash + mpesa + cheque);
    let balance = Number(req.body.balance - amount);

    let arrAmount=[];
    arrAmount ={
      cash: cash,
      mpesa: {
        amount: mpesa,
        transaction: mpesa_id
      },
      cheque: {
        amount: cheque,
        transaction: cheque_id
      },
      card: card
    }

       let payment= new PaymentClient();
       payment.sale = req.body.id;
       payment.mode_of_pay = arrAmount;
       payment.amount = amount;
       payment.balance = Number(balance);
       payment.user =req.user.id;

      payment.save(function(err){
        if(err){console.log(err);return;}
        else{
          req.flash('success','Payment added');
          res.redirect('/sale/view/'+req.body.id);
        }
      });
});

//Update Sale Status
router.post('/sale_status/:id', (req, res) => {

     let query = {_id: req.params.id};
     let new_status =req.body.status;

      Sale.update(query,{ status: new_status}).exec();
      let status = new SaleStatus();
      status.sale = req.params.id;
      status.status = new_status;
      status.save(function(err){});

      SaleProducts.find({sale:req.params.id},(err, sale)=>{
        SaleImei.find({},(err, saleImei)=>{
        CollectedProductsVendorInfo.find({},(err, collected)=>{
          for (var s = 0; s < sale.length; s++) {
          for (var i = 0; i < saleImei.length; i++) {
            if (saleImei[i].sale == sale[s].id) {
              for (var c = 0; c < collected.length; c++) {
                if (saleImei[i].imei == collected[c].id) {
                  if (new_status == 'Cancelled') {
                    SaleImei.remove({ _id:saleImei[i].id }, function (err) {
                      CollectedProductsVendorInfo.updateMany({ _id: collected[c].id },{ $set:{ status: 'Collected' }}, { multi: true }).exec();
                    });
                  } else {
                    CollectedProductsVendorInfo.update({_id:collected[c].id},{ status: new_status}).exec();
                  }

                }
              }
            }
            }

          }
        });
      });
      });

      //req.flash('success','Sale Status Updated');
        //  res.redirect('/sale/view/'+req.body.id);
        res.send(new_status);
});

//Get Sale Status Info
router.get('/status_edit/:id',(req, res, next)=>{
  SaleStatus.findById({_id:req.params.id},(err,status)=>{
    res.render('pages/sale/status',{
      status: status
    });
  })
});

//Update Sale Status
router.post('/status_edit/:id', (req, res, next) => {

     let query = {_id: req.params.id};
     let reason =req.body.reason;

      SaleStatus.update(query,{ reason: reason}).exec();
         res.redirect('/sale/view/'+req.body.id);
});

////////////////////////////////
////////AJax Functions/////////
///////////////////////////////

//Search Clients From Sale Records
router.get('/client_search/:id',function(req, res,next){
  //var regex = new RegExp(req.query["term"], 'i');
  var reg=new RegExp(req.params.id, 'i');
  Sale.distinct('first_name',{phone: reg},function(err, fname){
    Sale.distinct('last_name',{phone: reg},function(err,lname){
      Sale.distinct('phone',{phone: reg},function(err, phone){
        Sale.distinct('email',{phone: reg},function(err, email){
          if(err){console.log(err);return err;}
          res.render('pages/ajax/client_search',{
            fname: fname,
            lname: lname,
            phone: phone,
            email: email
          });
        });
      });
    });
  });
});

//Add Selected Product To Sale
router.get('/add_prod/:id',function(req, res,next){
  CollectedProductsVendor.findById(req.params.id,function(err, col){
    Products.find({},(err, products)=>{
      if(err){console.log(err);return err;}
      res.render('pages/ajax/add_prod',{
        col: col,
        products: products
      });
    })
  });
});

//Add Selected Product To Sale Total
router.get('/add_prod_top/:id/:total',function(req, res,next){
  CollectedProductsVendor.findById(req.params.id,function(err, col){
    Products.find({},function(err, products){
    if(err){console.log(err);return err;}
    res.render('pages/ajax/add_prod_top',{
      col: col,
      products: products,
      total: req.params.total
    });
  });
  });
});

//Minus Selected Product To Sale Total
router.get('/add_prod_down/:id/:total',function(req, res,next){
  CollectedProductsVendor.findById(req.params.id,function(err, col){
  Products.find({},function(err, products){
    if(err){console.log(err);return err;}
    res.render('pages/ajax/add_prod_down',{
      col: col,
      products: products,
      total: req.params.total
    });
  });
  });
});

//Collected Products From Vendor
router.get('/col_vendor/:id',function(req, res,next){
  Vendor.findById(req.params.id,function(err, vendor){
    ProductsVendor.find({vendor:req.params.id},function(err, pvendor){
      Products.find({},function(err, products){
          if(err){console.log(err);return err;}
          res.render('pages/ajax/col_vendor',{
            products: products,
            pvendor:pvendor,
            vendor: vendor
          });
      });
    });
  });
});

//Edit Product Sale Info
router.get('/edit_prod_sale/:id', function(req, res, next){
    Sale.findById(req.params.id,function(err, sale){
      SaleProducts.findById(req.params.id,function(err, saleProd){
        Products.find({}, function(err, products){
          ProductsVendor.find({},function(err, pvendor){
            Vendor.find({},function(err, vendor){
              res.render('pages/ajax/edit_prod_sale',{
              products: products,
              saleProd: saleProd,
              sale: sale,
              pvendor:pvendor,
              vendor: vendor
              });
            });
          });
        });
      });
    });
});

//Get Product Sale Info
router.get('/add_imei/:id', function(req, res, next){
    Sale.find({},function(err, sale){
      SaleProducts.find({product:req.params.id},function(err, saleProd){
        SaleImei.find({},(err, imei)=>{
          Products.find({}, function(err, products){
            ProductsVendor.find({},function(err, pvendor){
              Vendor.find({},function(err, vendor){
                CollectedProductsVendorInfo.find({collected:req.params.id,"status": {$ne: "Closed"}},(err,col)=>{
                  res.render('pages/ajax/add_imei',{
                  products: products,
                  saleProd: saleProd,
                  sale: sale,
                  pvendor:pvendor,
                  vendor: vendor,
                  col: col,
                  imei: imei
                  });
                });
              });
            });
          });
        })
      });
    });
});

//Get Product Sale Info
router.get('/edit_imei/:id', function(req, res, next){
    Sale.find({},function(err, sale){
      SaleProducts.find({product:req.params.id},function(err, saleProd){
        Products.find({}, function(err, products){
          ProductsVendor.find({},function(err, pvendor){
            Vendor.find({},function(err, vendor){
              CollectedProductsVendorInfo.find({},(err,col)=>{
                SaleImei.find({sale:req.params.id},(err,imei)=>{
                  res.render('pages/ajax/edit_imei',{
                    products: products,
                    saleProd: saleProd,
                    sale: sale,
                    pvendor:pvendor,
                    vendor: vendor,
                    col: col,
                    imei: imei
                  });
                })
              });
            });
          });
        });
      });
    });
});

//Remove Imei From Sale
router.get('/delete_imei/:id/:col',(req, res, next)=>{
  SaleImei.remove({ _id:req.params.id }, function (err) {
    CollectedProductsVendorInfo.updateMany({ _id:req.params.col },{ $set:{ status: 'Collected' }}, { multi: true }).exec();
    res.redirect('/sale/view/'+req.params.id);
  });
});

//Sale Payment
router.get('/sale_payment/:id', function(req, res, next){
    Sale.findById(req.params.id,function(err, sale){
      SaleProducts.find({},function(err, saleProd){
        PaymentClient.find({sale:req.params.id}, function(err, payment){
          res.render('pages/ajax/sale_payment',{
          payment: payment,
          saleProd: saleProd,
          sale: sale
          });
        });
      });
    });
});

//Sale PDF
router.get('/sale_pdf/:id',(req, res, next)=>{
  Sale.findById(req.params.id ,(err,sale)=> {
    res.render('pages/sale/sale_pdf',{
      sale: sale
      });
    });
  });


module.exports = router;
