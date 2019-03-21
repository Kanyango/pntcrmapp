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
let ProductsVendor = require('../models/products_vendor');
let Category = require('../models/product_category');
let Attributes = require('../models/product_attributes');
let Entities = require('../models/product_entities');
let Brand = require('../models/product_brand');
let AttribEntities = require('../models/product_attributesEntities');
let ProductEntities = require('../models/product_entities_val');
let PhoneProductsFeatured = require('../models/phone_products_featured');
let PhoneMainCategory = require('../models/phone_main_category');
let DeliveryLocation = require('../models/delivery_locations');
let CourierLocation = require('../models/courier_location');
let Courier = require('../models/courier');


module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = config.secter;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    UserWeb.findOne({id: jwt_payload.id}, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (user) {
              done(null, user);
          } else {
              done(null, false);
          }
      });
  }));
};

/////////////////////////////////////////////////////////////
///////////////API Users INFO////////////////////////////////
/////////////////////////////////////////////////////////////

router.post('/signup', function(req, res) {
  console.log(req.body);
  if (!req.body.email || !req.body.password) {
    res.json({success: false, msg: 'Please pass email and password.'});
  } else {
    var newUser = new UserWeb({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if (err) {
          console.log(err);
        }
        newUser.password = hash;
        // save the user
        newUser.save(function(err) {
          if (err) {
            return res.json({success: false, msg: 'Email already exists.'});
          }
          res.json({success: true, msg: 'Successful created new user.'});
        });
      });
    });

  }
});

router.post('/signin', function(req, res) {
  UserWeb.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      bcrypt.compare(req.body.password, user.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), config.secter);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

/////////////////////////////////////////////////////////////
////////////API Products INFO////////////////////////////////
/////////////////////////////////////////////////////////////

//Get All Products
router.get('/products', function(req, res, next){
  Products.find({}, function(err, products){
    res.json(products);
  });
});

//Get Product Info
router.get('/product-info/:id', function(req, res, next){
  Products.
  findOne({url:req.params.id}).
  populate('associate_products','title url price special_price images',Products).
  exec(function (err, products) {
    if (err) console.log(err);
    res.json(products);
  });
  // Products.findOne({url:req.params.id}, function(err, products){
  //   res.json(products);
  // });
});

//Get Featured Products
router.get('/product-featured', function(req, res, next){
  PhoneProductsFeatured.find({},(err,featured)=>{
    Products.find({}, function(err, products){
      let prod=[];
      for(var f of featured){
        for(var p of products){
            if(f.product == p.id){
              prod.push(p);
            }
        }
      }
      res.json(prod);
    });
  });
});

//Get All Categories
router.get('/category', function(req, res, next){
  Category.find({},(err,category)=>{
    Category.find({parent:0},(err,cat)=>{
      //  let menu=[];
      // for (var c of cat) {
      //   c['Child']=
      //   let menu2=[];
      //   // for (var c2 of category) {
      //   //   if(c.id == c2.parent){
      //   //     menu2.push(c2);
      //   //     for(c3 of category){
      //   //       let menu3=[c2.id];
      //   //       if(c2.id == c3.parent){
      //   //         menu3.push(c3);
      //   //         menu.push(menu2)
      //   //       }
      //   //     }
      //   //   }
      //   // }
      //   menu.push(c);
      // }
      res.json({category:category,cat: cat});
    });
  });
});

//Get Category Info
router.get('/category-info/:id', function(req, res, next){
  Category.findOne({url:req.params.id},(err,category)=>{
  //  Products.find({category: category.id}, function(err, products){
      res.json(category);
      console.log(category);
    //});
  });
});
//Get Category Products
router.get('/category-products/:id', function(req, res, next){
  Category.findOne({url:req.params.id},(err,category)=>{
    Products.
    find({category: category._id,is_web_active: 1}).
    //populate('courier','name',Courier).
    sort({ price : 'ascending'}).
    exec(function (err, products) {
      if (err) console.log(err);
      res.json(products);
    });
      // Products.find({category: category._id,is_web_active: 1}, function(err, products){
      //   res.json(products);
      // });
  });
});

/////////Get Category Products
router.get('/all-category-info/:id', function(req, res, next){
  Category.findOne({url:req.params.id},(err,category)=>{
    Products.
    find({category: category._id,is_web_active: 1}).
    populate('attribute','title',Attributes).
    select(' price cost title url ').
    sort({ price : 'ascending'}).
    exec(function (err, products) {
      if (err) console.log(err);
      var prodArr=[];
      for(var p of products){
        prodArr.push(p.id);
      }
        ProductEntities.
        find({ products : { $in : prodArr }}).
        populate('entities','title identifier input_type',Entities).
        select(' value entities ').
        exec(function (err, pEntity) {
        res.json({products:products,pEntity:pEntity});
      });
    });
  });
});

//Get Category Info
router.get('/category-entity/:id', function(req, res, next){
   Category.findOne({url:req.params.id},(err,category)=>{
    Products.find({category: category.id,is_web_active: 1},(err, products)=>{
      Attributes.find({},(err,attributes)=>{
        AttribEntities.find({},(err,attEnt)=>{
          Entities.find({},(err,entity)=>{
            ProductEntities.find({},(err,pEntity)=>{
              let att = [];
              let attE = [];
              let ent = [];
              let pEnt = [];
              for(var a of attributes){
                for(var p of products){
                  if(p.attribute == a.id ){
                    att.push(a);
                  }
                }
              }
              let uniqueAtt = Array.from(new Set(att));
              for(var a of uniqueAtt){
                for(var ae of attEnt){
                  if(ae.attributes == a.id){
                    attE.push(ae);
                  }
                }
              }
              for(var ae of attE){
                for(var e of entity){
                  if(e.id == ae.entities){
                    ent.push(e);
                  }
                }
              }
              for(var p of products){
                for(var e of pEntity){
                  if(p.id == e.products){
                    pEnt.push(e);
                  }
                }
              }

              res.json({entity:ent,product_entities:pEnt});
            });
          });
        });
      });
    });
   });
});

//Get Category Brand
router.get('/brand-entity/:id', function(req, res, next){
  Category.findOne({url:req.params.id},(err,category)=>{
    Products.find({category: category.id,is_web_active: 1},(err, products)=>{
      Attributes.find({},(err,attributes)=>{
        AttribEntities.find({},(err,attEnt)=>{
          Entities.find({},(err,entity)=>{
            ProductEntities.find({},(err,pEntity)=>{
              let att = [];
              let attE = [];
              let ent = [];
              let pEnt = [];
              for(var a of attributes){
                for(var p of products){
                  if(p.attribute == a.id ){
                    att.push(a);
                  }
                }
              }
              let uniqueAtt = Array.from(new Set(att));
              for(var a of uniqueAtt){
                for(var ae of attEnt){
                  if(ae.attributes == a.id){
                    attE.push(ae);
                  }
                }
              }
              for(var ae of attE){
                for(var e of entity){
                  if(e.id == ae.entities){
                    ent.push(e);
                  }
                }
              }
              for(var p of products){
                for(var e of pEntity){
                  if(p.id == e.products){
                    pEnt.push(e);
                  }
                }
              }

              res.json({entity:ent,product_entities:pEnt});
            });
          });
        });
      });
    });
  });
});

//Get Category Brand
router.get('/brand-entity/:id', function(req, res, next){
  Category.findOne({url:req.params.id},(err,category)=>{
    Products.find({category: category.id,is_web_active: 1},(err, products)=>{
      Brand.find({},(err,brand)=>{
        let brands=[];
        for(var b of brand){
          for(var p of products){
            if(b.id == p.brand){
              brands.push(b);
            }
          }
        }
        res.json(brands);
      });
    });
  });
});

//Get Home Category
router.get('/home-category', function(req, res, next){
  Category.find({parent:0},(err,category)=>{
    Products.find({}, function(err, products){
      PhoneMainCategory.find({},(err,main)=>{
        let mCat=[];
        let cat_title='';
        var cat_title1;
        for(var m of main){
          for(var c of category){
            if(c.id == m.category){
              cat_title=c.title;
              console.log(cat_title);
            }
          }
          let test='yes';
          m.category='yes';
          console.log(m.category);
          mCat.push(m);
        }
        res.json({mCat:mCat,category: category,products: products,main: main});
      });
    });
  });
});

router.get('/all-prod-brands', function(req, res, next){
  Products.distinct('brand', function (err, products) {
    Brand.find()
      .where('_id')
      .in(products)
      .exec(function (err, brands) {
        res.json(brands);
      });
  });
});

//Search Products
router.get('/products_search/:id',function(req, res,next){
  //var regex = new RegExp(req.query["term"], 'i');
  var reg=new RegExp(req.params.id, 'i');
  Products.
  find({title:reg,is_active:1}).
  //select('price images special_price url title').
  exec(function (err, product) {
    if (err) console.log(err);
    res.json(product);
  });
});

/////////////////////////////////////////////////////////////
////////////API Cache INFO////////////////////////////////
/////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////
////////////API Orders INFO////////////////////////////////
/////////////////////////////////////////////////////////////

//Get Delivery
router.get('/delivery-location', function(req, res, next){
  DeliveryLocation.find({},(err,delivery)=>{
    res.json(delivery);
  });
});

//Get Courier
router.get('/courier/:id', function(req, res, next){
  CourierLocation.
  find({branch:req.params.id}).
  populate('courier','name',Courier).
  exec(function (err, location) {
    if (err) console.log(err);
    res.json(location);
  });
});

//Get Courier
router.get('/courier-fee/:id', function(req, res, next){
  CourierLocation.findById(req.params.id,'amount',(err,fee)=>{
    res.json(fee.amount);
  });
});
module.exports = router;
