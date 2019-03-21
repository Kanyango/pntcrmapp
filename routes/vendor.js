const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const slugify = require('slugify');

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

router.get('/', function(req, res, next){
  Vendor.find({},function(err, vendors){
      res.render('pages/vendor/index',{
        vendors: vendors
      });
  });
});

//Add Vendor Form
router.get('/add', function(req, res, next){
  res.render('pages/vendor/add');
});

//Add Vendor Route
router.post('/add', function(req,res){

  // Validation
  req.checkBody('name', 'Vendor Name is required').notEmpty();
  req.checkBody('phone', 'Phone number is required').notEmpty();

  req.asyncValidationErrors().then(() => {
    const name = req.body.name;
    const url = slugify(req.body.name);
    const email = req.body.email;
    const phone = req.body.phone;
    const location = req.body.location;

    //Get Errors
    let errors = req.getValidationResult();

    // if (errors) {
    //   //console.log(first_name);
    //
    //   res.render('pages/driver/add',{
    //     errors: errors
    //   });
    // } else {
      let vendor= new Vendor({
        name:name,
        url:url,
        email:email,
        phone:phone,
        location: location
      });

          vendor.save(function(err){
            if (err) {
              console.log(err);
            } else {
              req.flash('success', 'Vendor is now Registered');
              res.redirect('/vendor');
            }
          });
    //}
  }).catch((errors) => {

      if(errors) {
        for (var i = 0; i < errors.length; i++) {
          var param = errors[i].param;
          var msg = errors[i].msg;
          req.flash('danger', errors[i].msg);
        }
        res.redirect('/vendor/add');
        return;
      };
  });
});

// View
router.get('/view/:id', function(req, res, next){
   Vendor.findById(req.params.id, (err, vendor)=>{
    CollectedProductsVendor
    .find({vendor:vendor._id})
    .populate('product','title',Products)
    .populate('user','middle_name first_name last_name',User)
    .exec((err,collected)=>{
      Products.find({},(err,products)=>{
        //User.find({},(err,user)=>{
          CollectedProductsVendorInfo.find({},(err,collectedInfo)=>{
            ProductsVendor.
            find({vendor:req.params.id}).
            populate('products','title url price special_price cost',Products).
            exec((err, pVendor)=>{
              res.render('pages/vendor/view',{
                vendor: vendor,
                //user: user,
                products: products,
                collected: collected,
                collectedInfo: collectedInfo,
                pVendor: pVendor
             // });
            });

          });
        });
      });
    });
   });
  // CollectedProductsVendor.
  // find({vendor:req.params.id}).
  // populate('product','title url price special_price cost',Products).
  // populate('col_user','first_name middle_name last_name',User).
  // exec(function (err, collected) {
  //   let collArr = [];
  //   if (err) {
  //     return res.status(500).send({message: err.message});
  //   }
  //   if (collected) {
  //     collected.forEach(prod => {
  //       collArr.push(prod);
  //     });
  //   }
  //   res.send(collArr);
  // });


});

// edit
router.get('/edit/:id', function(req, res, next){
  Vendor.findById(req.params.id, function(err, vendor){
    res.render('pages/vendor/edit',{
      vendor: vendor
    });
  });
});

//Update Vendor
router.post('/edit/:id', (req, res) => {

     let query = {_id: req.params.id};
     let name = req.body.name;
     let email = req.body.email;
     let phone = req.body.phone;
     let location = req.body.location;

     Vendor.updateMany({ _id:req.params.id },{ $set:{ name: name , email: email , phone: phone , location: location }}, { multi: true }).exec();
          res.redirect('/vendor/view/'+req.params.id);
});

//Collected Product Edit
router.get('/collected/edit/:id', function(req, res, next){
  CollectedProductsVendor.find({},function(err, cproducts){
    CollectedProductsVendorInfo.findById(req.params.id,(err,cprodI)=>{
      Products.find({},function(err, products){
        ProductBrand.find({}, function(err, brand){
            ProductsVendor.find({},function(err, pvendor){
              Vendor.find({},function(err, vendor){
              res.render('pages/vendor/collected/edit',{
                products: products,
                brand: brand,
                pvendor:pvendor,
                vendor: vendor,
                cproducts: cproducts,
                cprodI:cprodI
      });
    });
});
});
});
});
});
});

//Update Product IMEI
router.post('/collected/edit/:id', (req, res) => {

     let query = {_id: req.params.id};
     let imei =req.body.imei;

      CollectedProductsVendorInfo.updateMany({ _id:req.params.id },{ $set:{ imei: imei }}, { multi: true }).exec();
         res.redirect('/sale/vendor_prod_info/'+req.body.id);
});

//Collected Product Edit
router.get('/collected/status/:id', function(req, res, next){
  CollectedProductsVendor.find({},function(err, cproducts){
    CollectedProductsVendorInfo.findById(req.params.id,(err,cprodI)=>{
      Products.find({},function(err, products){
        ProductBrand.find({}, function(err, brand){
            ProductsVendor.find({},function(err, pvendor){
              Vendor.find({},function(err, vendor){
              res.render('pages/vendor/collected/status',{
                products: products,
                brand: brand,
                pvendor:pvendor,
                vendor: vendor,
                cproducts: cproducts,
                cprodI:cprodI
      });
    });
});
});
});
});
});
});

//Update Product IMEI Status
router.post('/collected/status/:id', (req, res) => {

     let query = {_id: req.params.id};
     let status =req.body.status;

      CollectedProductsVendorInfo.updateMany({ _id:req.params.id },{ $set:{ status: status }}, { multi: true }).exec();
         res.redirect('/sale/vendor_prod_info/'+req.body.id);
});

//Vendor make Payments
router.get('/make-payment/:id', function(req, res, next){
  Vendor.findById(req.params.id,function(err, vendor){
  CollectedProductsVendor.find({vendor: vendor.id},function(err, cproducts){
    CollectedProductsVendorInfo.find({status:"Closed"},(err,cprodI)=>{
      Products.find({},function(err, products){
        ProductBrand.find({}, function(err, brand){
            ProductsVendor.find({},function(err, pvendor){
                SaleProducts.find({},(err,saleP)=>{
                Sale.find({status:"Closed"},(err, sale)=>{
                  SaleImei.find({},(err,imei)=>{
                res.render('pages/vendor/payments/pay',{
                  products: products,
                  brand: brand,
                  pvendor:pvendor,
                  vendor: vendor,
                  cproducts: cproducts,
                  cprodI:cprodI,
                  saleP: saleP,
                  sale: sale,
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

//SAVE NEW SALE
router.post('/make-payment/:id', function(req, res){
  let pay = new PaymentVendor();

  pay.vendor = req.params.id;
  pay.amount = req.body.amount;
  pay.balance = req.body.total2 - req.body.amount;
  pay.user = req.user.id;

 pay.save(function(err, new_pay){
   let payId = new_pay._id;
    if(err){
      req.flash('danger','Payment not Done');
      console.log(err);
      return;
    } else{

      let imei =req.body.imei;
      for (var i = 0; i < imei.length; i++) {
        var newImei = imei[i];//new Array();
        newImei = imei[i].split(",");
        console.log('New:'+newImei);
        for (var n = 0; n < newImei.length; n++) {
          let pI= new PaymentVendorImei();
              pI.payment= payId;
              pI.collected = newImei[n];
              console.log(newImei[n]);
              console.log(pI);
             pI.save(function(err){
               if(err){
                 console.log(err);
               }
             });
        }

      }

      req.flash('success','Payment Success');
      res.redirect('/vendor/view/'+req.params.id);
    }
  });

});

//Vendor Payments
router.get('/payments/', function(req, res, next){
  CollectedProductsVendor.find({},function(err, cproducts){
    CollectedProductsVendorInfo.find({status:"Closed"},(err,cprodI)=>{
      Products.find({},function(err, products){
        ProductBrand.find({}, function(err, brand){
            ProductsVendor.find({},function(err, pvendor){
              Vendor.find({},function(err, vendor){
                SaleProducts.find({},(err,saleP)=>{
                Sale.find({status:"Closed"},(err, sale)=>{
                  SaleImei.find({},(err,imei)=>{
                res.render('pages/vendor/payments/index',{
                  products: products,
                  brand: brand,
                  pvendor:pvendor,
                  vendor: vendor,
                  cproducts: cproducts,
                  cprodI:cprodI,
                  saleP: saleP,
                  sale: sale,
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

//Update Quick Product info
router.post('/quick-edit-info/:id/:product', (req, res) => {

     let query = {_id: req.params.id};
     let cost = req.body.cost;
     let feature = req.body.feature;

     ProductsVendor.updateMany(query,{ $set:{ cost: cost, feature:feature }}, { multi: true }).exec();
console.log(req.body);
         res.redirect('/vendor/view/'+req.params.product);
});

//Add Products Vendor
router.post('/add-product/:id', function(req, res, next){
  req.checkBody('product','Product is required').notEmpty();

  req.asyncValidationErrors().then(() => {
    const product = req.body.product;
    const cost = req.body.cost;
    const feature = req.body.feature;
    for (var i = 0; i < product.length; i++) {
      let ven= new ProductsVendor();
      ven.vendor = req.params.id
      ven.products = product[i];
      ven.cost = cost[i];
      ven.feature = feature[i];
       ven.save(function(err){
         if(err){
           console.log(err);
         }
       });
      console.log(ven);
    }

         req.flash('success','Product Vendor added');
         res.redirect('/vendor/view/'+req.params.id);
  }).catch((errors) => {

      if(errors) {console.log(errors);
        for (var i = 0; i < errors.length; i++) {
          var param = errors[i].param;
          var msg = errors[i].msg;
          req.flash('danger', errors[i].msg);
        }
        res.redirect('/vendor/view/'+ req.params.id);
        return;
      };
  });
});

//Delete Products Vendor
router.get('/delete-product/:vendor/:product', function(req, res, next){
  ProductsVendor.remove({ _id:req.params.product }, function (err) {
    res.redirect('/vendor/view/'+req.params.vendor);
  });
});

router.get('/ajax_quick_edit/:id/:product',(req, res, next)=>{
  ProductsVendor.
  findById(req.params.id).
  populate('products','title ',Products).
  exec((err,products)=>{
    res.send('<form action="/vendor/quick-edit-info/'+ products.id +'/'+ req.params.product +'" method="post" role="form" class="row"><div class="col-md-6 col-sm-6 col-xs-12 form-group has-feedback"><label class="control-label col-md-3 col-sm-3 col-xs-12" for="cost">Title </label><div class="col-md-9 col-sm-9 col-xs-12">'+products.products.title +'</div></div><div class="col-md-6 col-sm-6 col-xs-12 form-group has-feedback"><label class="control-label col-md-3 col-sm-3 col-xs-12" for="cost">Cost </label><div class="col-md-9 col-sm-9 col-xs-12"><input type="text" name="cost" class="form-control" placeholder="Cost" value="'+products.cost +'" required></div></div><div class="col-md-6 col-sm-6 col-xs-12 form-group has-feedback"><label class="control-label col-md-3 col-sm-3 col-xs-12" for="feature">Feature </label><div class="col-md-9 col-sm-9 col-xs-12"><input type="text" name="feature" class="form-control" placeholder="Product Feature" value="'+products.feature +'"></div></div><div class="clearfix"></div></div><div class="form-group"><div class="col-md-9 col-sm-9 col-xs-12 col-md-offset-3"><button type="submit" class="btn btn-success">Submit</button></div></div></form>');
  });
});
module.exports = router;
