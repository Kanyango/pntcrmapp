const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const slugify = require('slugify');
const request = require('request');
const fs = require('fs');

let Products = require('../models/products');
let Vendor = require('../models/vendor');
let ProductsVendor = require('../models/products_vendor');
let Category = require('../models/product_category');
let Attributes = require('../models/product_attributes');
let Entities = require('../models/product_entities');
let Brand = require('../models/product_brand');
let AttribEntities = require('../models/product_attributesEntities');
let ProductEntities = require('../models/product_entities_val');
let Tags = require('../models/product_tags');

router.get('/', function(req, res, next){
  Products.
  find({deleted:0}).
  select('title category price reseller_price special_price is_active is_web_active stock deleted').
  //populate('category','title',Category).
  exec((err, products)=>{
    Category.find({},(err,cat)=>{
      res.render('pages/products/index',{
        products: products,
        cat: cat
      });
    });
  });
});



//Create Form
router.get('/add', function(req, res, next){
  Attributes.find({},function(err, attrib){
    Brand.find({}, function(err, brand){
      Category.find({}, function(err, category){
        Vendor.find({}, function(err, vendor){
          res.render('pages/products/add',{
            vendor: vendor,
            attrib: attrib,
            brand: brand,
            category: category
          });
        });
      });
    });
  });
});

//Create Form
router.get('/quick-add', function(req, res, next){
  Attributes.find({},function(err, attrib){
    Brand.find({}, function(err, brand){
      Category.find({}, function(err, category){
        Vendor.find({}, function(err, vendor){
          res.render('pages/products/quick-add',{
            vendor: vendor,
            attrib: attrib,
            brand: brand,
            category: category
          });
        });
      });
    });
  });
});

//Add Products
router.post('/add', (req, res) => {
  req.checkBody('title','Title is required').notEmpty();

  //Get Errors
  let errors = req.validationErrors();

  if (errors) {
    res.render('pages/products/add',{
      errors: errors
    });
    console.log(errors);
  } else {

    let products= new Products();
    products.category = req.body.category;
    products.brand = req.body.brand;
    products.attribute = req.body.attrib_type;
    products.title = req.body.title;
    products.url = slugify(req.body.title,{remove: /[$*_+~.()'"!:@]/g,lower: true});
    products.price = req.body.price;
    products.reseller_price = req.body.reseller_price;
    products.cost = req.body.cost;
    products.special_price = req.body.special_price;
    products.descriptions.box_content = req.body.box_content;
    products.descriptions.short = req.body. short;
    products.descriptions.full = req.body.full;
    var img = req.body.img;
    var sort = req.body.sort;

    var image=[];
    for (var i = 0; i < img.length; i++) {
      image[i]=[img[i],sort[i]];
    }
    products.images = image;

      products.save(function(err, new_product){
        let prodId = new_product._id;

       if(err){
         req.flash('danger','Product not added');
        console.log(err);
         return;
       } else{
    //Options Creations
    // var optionsArray = [];
    // for (var key of req.body.options){
    //      if ( Array.isArray(req.body['opt_val_'+key])) {
    //        Entities.findById(key,(err, entity)=>{
    //          for (var value of req.body['opt_val_'+entity.id]){

    //             console.log('entity1: '+entity);
    //          console.log('second1: '+req.body['opt_val_'+entity.id]);
    //          console.log('second2: '+value);
    //           optionsArray[entity.id]= value ;
    //           var pEntity = new ProductEntities();

    //           pEntity.products = prodId;
    //           pEntity.entities =entity.id;
    //           pEntity.value = value;
    //           console.log('third: '+pEntity);
    //           pEntity.save(function(err){
    //             if(err){
    //               req.flash('danger','Product not added');
    //              console.log(err);
    //               return;
    //             }
    //           });

    //        }
    //        });
    //      } else {
    //        Entities.findById(key,(err, entity)=>{
    //          console.log('entity2: '+entity);
    //        console.log('fourth: '+req.body['opt_val_'+entity.id]);
    //        var pEntity = new ProductEntities();
    //          pEntity.products = prodId;
    //          pEntity.entities =entity.id;
    //          pEntity.value = req.body['opt_val_'+entity.id];
    //          console.log('fifth: '+pEntity);
    //          pEntity.save(function(err){
    //            if(err){
    //              req.flash('danger','Product not added');
    //             console.log(err);
    //              return;
    //            }
    //          });
    //         });
    //      }
    // }
         req.flash('success','Product added');
         res.redirect('/products/view/'+prodId);
      }
    });
  }
});

//Add Quick Products
router.post('/quick-add', (req, res) => {
  req.checkBody('title','Title is required').notEmpty();
  req.checkBody('category', 'Please Select a Category').notEmpty();
  req.checkBody('brand', 'Please Select a Brand').notEmpty();
  req.checkBody('attrib_type', 'Please Select an Attribute').notEmpty();
  req.checkBody('price', 'Please Select a Price').notEmpty();
  req.checkBody('cost', 'Please Select a Cost').notEmpty();

  req.asyncValidationErrors().then(() => {

    let products= new Products();
    products.category = req.body.category;
    products.brand = req.body.brand;
    products.attribute = req.body.attrib_type;
    products.title = req.body.title;
    products.url = slugify(req.body.title,{remove: /[$*_+~.()'"!:@]/g,lower: true});
    products.price = req.body.price;
    products.cost = req.body.cost;
    products.special_price = req.body.special_price;
    products.reseller_price = req.body.reseller_price
    products.descriptions.box_content = '';
    products.descriptions.short = '';
    products.descriptions.full = '';
    products.is_active = 1;

      products.save(function(err, new_product){
        let prodId = new_product._id;

       if(err){
         req.flash('danger','Product not added');
        console.log(err);
         return;
       } else{

         req.flash('success','Product added');
         res.redirect('/products/view/'+prodId);
      }
    });
  }).catch((errors) => {

      if(errors) {console.log(errors);
        for (var i = 0; i < errors.length; i++) {
          var param = errors[i].param;
          var msg = errors[i].msg;
          req.flash('danger', errors[i].msg);
        }
        res.redirect('/products/quick-add');
        return;
      };
  });
});

//Products View
router.get('/view/:id', function(req, res, next){
  Products.
  findById(req.params.id). 
  //populate('associate_products','title url price special_price images',Products).
  exec(function(err, products){
      ProductsVendor.
      find({products:req.params.id}).
      populate('vendor','name',Vendor).
      exec((err,pvendor)=>{
        Brand.findById(products.brand,(err,brand)=>{
          Category.findById(products.category,(err,category)=>{
            Category.find({},(err,allcategory)=>{
              ProductEntities.find({products:products.id},(err,p_entity)=>{
                Entities.find({},(err,entity)=>{
                  AttribEntities.find({},(err,a_entity)=>{
                    Products.find({}, function(err, allprod){
                      Tags.find({}, function(err, tags){
                        res.render('pages/products/view',{
                          products: products,
                          pvendor:pvendor,
                          brand: brand,
                          category: category,
                          allcategory: allcategory,
                          p_entity: p_entity,
                          entity: entity,
                          a_entity: a_entity,
                          allprod:allprod,
                          tags:tags
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

//Add Products Vendor
router.get('/add-vendor/:id', function(req, res, next){
  Products.findById(req.params.id, function(err, products){
    Vendor.find({}, function(err, vendor){
      ProductsVendor.find({products:req.params.id},(err,pvendor)=>{
        res.render('pages/products/add-vendor',{
          products: products,
          vendor: vendor,
          pvendor:pvendor
        });
      });
    });
  });
});

//Add Products Vendor
router.post('/add-vendor/:id', function(req, res, next){
  req.checkBody('vendor','Vendor is required').notEmpty();

  req.asyncValidationErrors().then(() => {
    const vendor = req.body.vendor;
    const cost = req.body.cost;
    const feature = req.body.feature;

    for (var i = 0; i < vendor.length; i++) {
      let ven= new ProductsVendor();
      ven.products = req.params.id
      ven.vendor = vendor[i];
      ven.cost = cost[i];
      ven.feature = feature[i];
       ven.save(function(err){
         if(err){
           console.log(err);
         }
       });
    }

         req.flash('success','Product Vendor added');
         res.redirect('/products/view/'+req.params.id);
  }).catch((errors) => {

      if(errors) {console.log(errors);
        for (var i = 0; i < errors.length; i++) {
          var param = errors[i].param;
          var msg = errors[i].msg;
          req.flash('danger', errors[i].msg);
        }
        res.redirect('/products/add-vendor/'+ req.params.id);
        return;
      };
  });
});

//Add Products associated
router.get('/add-associated/:id', function(req, res, next){
  Products.findById(req.params.id, function(err, products){
    Products.find({}, function(err, allprod){
      Vendor.find({}, function(err, vendor){
        ProductsVendor.find({products:req.params.id},(err,pvendor)=>{
          res.render('pages/products/add-associated',{
            products: products,
            vendor: vendor,
            pvendor:pvendor,
            allprod: allprod
          });
        });
      });
    });
  });
});

//Add Product Associated
router.post('/add-associated/:id', function(req, res, next){
let product = req.body.product;
        Products.updateMany({ _id:req.params.id },{ $set:{ associate_products: product }}, { multi: true }).exec();
console.log(req.body);
         req.flash('success','Product Vendor added');
         res.redirect('/products/view/'+req.params.id);
});

//Delete Main Category Product
router.get('/delete-associated/:id/:prod', function(req, res){
  Products.findById(req.params.id,(err,prod)=>{
    let products = prod.associate_products;
    var i = products.indexOf(req.params.prod);
if(i != -1) {
	products.splice(i, 1);
}
   Products.updateMany({ _id:req.params.id },{ $set:{ associate_products: products }}, { multi: true }).exec();
        res.redirect('/products/view/'+req.params.id);
  });
});

//Delete Products Vendor
router.get('/delete-vendor/:id/:product', function(req, res, next){
  ProductsVendor.remove({ _id:req.params.id }, function (err) {
    res.redirect('/products/view/'+req.params.product);
  });
});

//Edit Products Vendor
router.get('/edit-vendor/:id', function(req, res, next){
  Products.findById(req.params.id,(err,products)=>{
    ProductsVendor.find({}, function(err, pvendor){
      Vendor.find({}, function(err, vendor){
        res.render('pages/products/add-vendor',{
          products: products,
          vendor: vendor,
          pvendor:pvendor
        });
      });
    });
  });
});

//Assign Vendor
router.post('/assign_vendor', (req, res) => {
  req.checkBody('vendor','Vendor is required').notEmpty();

  //Get Errors
  let errors = req.validationErrors();

  if (errors) {
    res.render('pages/products/add',{
      errors: errors
    });
    console.log(errors);
  } else {
    let prod_ven= new ProductsVendor();
    prod_ven.products = req.body.product_id;
    prod_ven.vendor = req.body.vendor;

      prod_ven.save(function(err){
      if(err){
        req.flash('danger','Product not added');
        console.log(err);
        return;
      } else{
        req.flash('success','Product added');
        res.redirect('/products/view/'+req.body.product_id);
      }
      });
  }
});

//Products edit Info
router.get('/edit-info/:id', function(req, res, next){
  Products.findById(req.params.id, function(err, products){
    Vendor.find({}, function(err, vendor){
      ProductsVendor.find({products:req.params.id},(err,pvendor)=>{
        res.render('pages/products/edit-info',{
          products: products,
          vendor: vendor,
          pvendor:pvendor
        });
      });
    });
  });
});

//Update Product info
router.post('/edit-info/:id', (req, res) => {

     let query = {_id: req.params.id};
     let title = req.body.title;
     let price = req.body.price;
     let cost = req.body.cost;
     let special_price = req.body.special_price;

    Products.updateMany({ _id:req.params.id },{ $set:{ title: title , price: price , special_price:special_price, cost: cost }}, { multi: true }).exec();
         res.redirect('/products/view/'+req.params.id);
});

//Update Product Front  Images
router.post('/edit-front-image/:id', (req, res) => {
  let small = req.body.front_small;
  let big = req.body.front_big;

 Products.updateMany({ _id:req.params.id },{ $set:{ image_front_small: small , image_front_big: big }}, { multi: true }).exec();
      res.redirect('/products/view/'+req.params.id);
});

//Update Product info Tags
router.post('/add-tag/:id', (req, res) => {
   Products.findById(req.params.id, function(err, product){
     let query = {_id: req.params.id};
     let tag = req.body.tag;
     let newTag = product.tags;
     if (newTag == '') {
       newTag = tag;
     } else {
       newTag.push(tag);
     }
     Products.update(query,{ tags: newTag}).exec();
     res.redirect('/products/view/'+req.params.id);
   });
});

//Remove Product Tags
router.get('/delete-tag/:id/:tag', (req, res) => {
   Products.findById(req.params.id, function(err, product){
     let query = {_id: req.params.id};
     let tag = req.params.tag;

     let oldTags = product.tags;
     var pos = oldTags.indexOf(tag);
     oldTags.splice(pos, 1);
     Products.update(query,{ tags: oldTags}).exec();
     res.redirect('/products/view/'+req.params.id);
   });
});

//Remove All Product Tags
router.get('/delete-tag-all/:id', (req, res) => {
     let query = {_id: req.params.id};
     Products.update(query,{ tags: ''}).exec();
     res.redirect('/products/view/'+req.params.id);
});

//Update Quick Product info
router.post('/quick-edit-info/:id', (req, res) => {

     let query = {_id: req.params.id};
     let title = req.body.title;
     let price = req.body.price;
     let special_price = req.body.special_price;
     let reseller_price = req.body.reseller_price;
     let cost = req.body.cost;

    Products.updateMany({ _id:req.params.id },{ $set:{ title: title , price: price,reseller_price:reseller_price ,special_price: special_price, cost: cost }}, { multi: true }).exec();
         res.redirect('/products/');
});

//Products edit Image
router.get('/edit-image/:id', function(req, res, next){
  Products.findById(req.params.id, function(err, products){
    res.render('pages/products/edit-image',{
      products: products,
    });
  });
});

//Update Product Image
router.post('/add-image/:id', (req, res) => {
  // var path = req.files.images.path;
  // var name = req.files.images.name;
  // console.log(path);
  // console.log(name);
//   var data = {
//   file: fs.createReadStream( req.body.images )
// };
// request.post({ url:'http://npt.phonestablets.co.ke/index.php', formData:data }, function callback( err, response, body ) {
//     if( err ) {
//         return console.error( 'Failed to upload:', err );
//     }
//     console.log( 'Upload successful!' );
// });

  Products.findById(req.params.id,(err,product)=>{console.log(req.body);
    let image = product.images;

    var img = req.body.img;
    var sort = req.body.sort;

    var imag=[];
    for (var i = 0; i < img.length; i++) {
      image.push([img[i],sort[i]]);
    }

    Products.updateMany({ _id:req.params.id },{ $set:{ images: image }}, { multi: true }).exec();
         res.redirect('/products/view/'+req.params.id);
  });
});

//Update Product Image
router.get('/delete-image/:id', (req, res) => {
  Products.findById(req.params.id,(err,product)=>{
    let oldImage = product.images;

    let image = req.body.image;
    console.log(image);
    var pos = oldImage.indexOf(image);
    oldImage.splice(pos, 1);
    let newImage = product.images;

    Products.updateMany({ _id:req.params.id },{ $set:{ images: oldImage }}, { multi: true }).exec();
    res.redirect('/products/view/'+req.params.id);
  });
});

//Update Product Status
router.post('/product_status/:id', (req, res) => {

     let query = {_id: req.params.id};
     let status =req.body.status;

      Products.update(query,{ is_active: status}).exec();

      if (status==0) {
        res.send('1');
      } else {
        res.send('0');
      }

});

//Deleted Products
router.get('/deleted', function(req, res, next){
  Products.find({deleted: 1},function(err, products){
    res.render('pages/products/deleted',{
      products: products
    });
  });
});

//Update Product Status Delete
router.get('/product_delete/:id', (req, res) => {

     let query = {_id: req.params.id};

      Products.updateMany(query,{ $set:{ deleted: 1,is_active: 0,is_web_active:0 }}, { multi: true }).exec();

      res.redirect('/products');

});

//Update Product Status Delete
router.get('/product_undelete/:id', (req, res) => {

     let query = {_id: req.params.id};

      Products.updateMany(query,{ $set:{ deleted: 0,is_active: 0,is_web_active:0 }}, { multi: true }).exec();

      res.redirect('/products');

});

//Update Product Web Status
router.post('/product_web_status/:id', (req, res) => {

     let query = {_id: req.params.id};
     let status =req.body.status;

      Products.update(query,{ is_web_active: status}).exec();
      if (status==0) {
        res.send('1');
      } else {
        res.send('0');
      }
});

//Update Product Stock Status
router.post('/product_stock_status/:id', (req, res) => {

  let query = {_id: req.params.id};
  let stock =req.body.stock;

   Products.update(query,{ stock: stock}).exec();
   if (stock==0) {
     res.send('1');
   } else {
     res.send('0');
   }
});

//Products edit description
router.get('/edit-description/:id', function(req, res, next){
  Products.findById(req.params.id, function(err, products){
    res.render('pages/products/edit-description',{
      products: products
    });
  });
});

//Update Product Description
router.post('/edit-description/:id', (req, res) => {

     let query = {_id: req.params.id};
     let box_content = req.body.box_content;
     let short = req.body.short;
     let full = req.body.full;
     let youtube = req.body.youtube;

     Products.updateMany({ _id:req.params.id },{ $set:{ descriptions:{youtube:youtube,box_content: box_content , short: short , full: full} }}, { multi: true }).exec();
          res.redirect('/products/view/'+req.params.id);
});

//Update Product Category
router.post('/edit-category/:id', (req, res) => {
     let category = req.body.category;
     Products.updateMany({ _id:req.params.id },{ $set:{ category: category }}, { multi: true }).exec();
          res.redirect('/products/view/'+req.params.id);
});

//Get Edit Entity
router.get('/edit-entity/:id', function(req, res, next){
  Products.findById(req.params.id, function(err, products){
    ProductEntities.find({products:req.params.id}, function(err, pentity){
      AttribEntities.find({attributes:products.attribute}, function(err, attrib){
        Entities.find({},(err,entity)=>{
          res.render('pages/products/edit-entity',{
            products: products,
            pentity: pentity,
            attrib: attrib,
            entity: entity
          });
        });
      });
    });
  });
});
//delete Entity
router.get('/delete-prod-ent/:id/:entity', (req, res) => {
  Products.findById(req.params.id,(err,product)=>{
    let olddesc = product.desc_entity;
    let newDesc=[];
    olddesc.forEach(entity => {
      if(entity.entity != req.params.entity){
        newDesc.push(entity);
      }
    });
    Products.updateMany({ _id:req.params.id },{ $set:{ desc_entity: newDesc }}, { multi: true }).exec();
    res.redirect('/products/view/'+req.params.id);
  });
});
//Post Add Entity
router.post('/add-entity/:id', (req, res) => {
  console.log(req.body);
  let id = req.body.product_id;
  let query = {_id: id};
  let entity = req.body.entity;
  let value = req.body.e_value;

    Products.update(query, { $push: { desc_entity: {entity:entity,value:value} } }).exec();
    // res.send(desc);
});

router.post('/edit-entity/:id', (req, res) => {
  var entity = req.body.entity;
  var entArr= [];
  var uniqueArr= [];
  for(let i = 0;i < entity.length; i++){
    if(uniqueArr.indexOf(entity[i]) == -1){
      uniqueArr.push(entity[i]);
        entArr.push({entity:entity[i],value:req.body['value_'+entity[i]]});
    }
  }  
  Products.updateMany({ _id:req.params.id },{ $set:{ desc_entity: entArr }}, { multi: true }).exec();
  res.redirect('/products/view/'+req.params.id);
});

router.post('/edit-entity11111/:id', (req, res) => {
  var optionsArray = [];
  console.log(req.body);
  for (var key of req.body.options){
    if ( Array.isArray(req.body['opt_val_'+key])) {
      console.log('Yes'+req.body['opt_val_'+key]);
    ProductEntities.findOne({entities:key,products:req.params.id},(err,pe)=>{
      //console.log(pe);
      if(pe){

        console.log('Y'+pe.entities);

      //  console.log('Yes-'+req.body['opt_val_'+pe.entities]);
      }else{
        console.log('N'+key);
      //  console.log('No-'+req.body['opt_val_'+key]);
      //  if ( Array.isArray(req.body['opt_val_'+key])) {
      //    Entities.findById(key,(err, entity)=>{
      //      for (var value of req.body['opt_val_'+entity.id]){
      //       optionsArray[entity.id]= value ;
      //       var pEntity = new ProductEntities();
       //
      //       pEntity.products = prodId;
      //       pEntity.entities =entity.id;
      //       pEntity.value = value;
      //       pEntity.save(function(err){
      //         if(err){
      //           req.flash('danger','Product not added');
      //          console.log(err);
      //           return;
      //         }
      //       });
       //
      //    }
      //    });
      //  } else {
      //    Entities.findById(key,(err, entity)=>{
      //    var pEntity = new ProductEntities();
      //      pEntity.products = prodId;
      //      pEntity.entities =entity.id;
      //      pEntity.value = req.body['opt_val_'+entity.id];
      //      pEntity.save(function(err){
      //        if(err){
      //          req.flash('danger','Product not added');
      //         console.log(err);
      //          return;
      //        }
      //      });
      //     });
      //  }
        }
      });
       //console.log(optionsArray);

  }
  else {
    console.log('No'+req.body['opt_val_'+key]);
  }
}
});

//Products edit Seo
router.get('/edit-seo/:id', function(req, res, next){
  Products.findById(req.params.id, function(err, products){
    res.render('pages/products/edit-seo',{
      products: products
    });
  });
});

//Update Product Description
router.post('/edit-seo/:id', (req, res) => {

     let query = {_id: req.params.id};
     let url = slugify(req.body.url,{remove: /[$*_+~.()'"!:@]/g,lower: true});
     let title = req.body.title;
     let keywords = req.body.keywords;
     let description = req.body.description;

     Products.updateMany({ _id:req.params.id },{ $set:{ url:url,seo:{description: description , keywords: keywords, title: title} }}, { multi: true }).exec();
          res.redirect('/products/view/'+req.params.id);
});

////////////////////////////////
////////AJax Functions/////////
///////////////////////////////
router.get('/attrib_type/:id',function(req, res,next){
  let query = {_id:req.params.id}
  let output='';
  AttribEntities.find({attributes:req.params.id}, function(err, attrib){

       Entities.find({}, function(err, entity){
         if(err){console.log(err);return err;}
         res.render('pages/ajax/attrib_type',{
           attrib: attrib,
           entity: entity
         });

       });
  });
});

router.get('/ajax_quick_edit/:id',(req, res, next)=>{
  Products.findById(req.params.id,(err,products)=>{
    res.send("<form action='/products/quick-edit-info/"+ products.id+"' method='post' role='form' class='row'><div class='col-md-12 col-sm-12 col-xs-12 row'><div class='col-md-12 col-sm-12 col-xs-12 form-group has-feedback'><label class='control-label col-md-3 col-sm-3 col-xs-12' for='title'>Title </label><div class='col-md-12 col-sm-12 col-xs-12'><input name='title' class='form-control' placeholder='Title' value='"+products.title+"' required></div></div><div class='col-md-6 col-sm-6 col-xs-12 form-group has-feedback'><label class='control-label col-md-3 col-sm-3 col-xs-12' for='price'>Price </label><div class='col-md-9 col-sm-9 col-xs-12'><input name='price' class = 'form-control' placeholder='Price' value='"+ products.price +"' required></div></div><div class='col-md-6 col-sm-6 col-xs-12 form-group has-feedback'><label class='control-label col-md-3 col-sm-3 col-xs-12' for='reseller_price'>Reseller Price </label><div class='col-md-9 col-sm-9 col-xs-12'><input name='reseller_price' class = 'form-control' placeholder='Reseller Price' value='"+ products.reseller_price +"' required></div></div><div class='col-md-6 col-sm-6 col-xs-12 form-group has-feedback'><label class='control-label col-md-12 col-sm-12 col-xs-12' for='special_price'>Special Price </label><div class='col-md-9 col-sm-9 col-xs-12'><input name='special_price' class = 'form-control' value='"+ products.special_price +"' placeholder='Special Price'></div></div><div class='col-md-6 col-sm-6 col-xs-12 form-group has-feedback'><label class='control-label col-md-3 col-sm-3 col-xs-12' for='cost'>Cost </label><div class='col-md-9 col-sm-9 col-xs-12'><input type='text' name='cost' class='form-control' placeholder='Cost' value='"+products.cost +"' required></div></div><div class='clearfix'></div></div><div class='form-group'><div class='col-md-9 col-sm-9 col-xs-12 col-md-offset-3'><button type='submit' class='btn btn-success'>Submit</button></div></div></form>");
  });
});

router.get('/ajax_quick_vendor/:id',(req, res, next)=>{
  ProductsVendor.
  find({products:req.params.id}).
  sort({cost:'ascending'}).
  populate('vendor','name',Vendor).
  exec((err,vendor)=>{
    res.render('pages/ajax/product_vendor',{
      vendor: vendor
    });
  });
});

module.exports = router;
