//price list export
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
let PhoneMainCategoryFoot = require('../models/phone_main_categories_foot');
let DeliveryLocation = require('../models/delivery_locations');
let CourierLocation = require('../models/courier_location');
let Courier = require('../models/courier');
let PhoneMainSlider = require('../models/phone_main_slider');
let PhoneMainShipping = require('../models/phone_main_shipping');
let Tags = require('../models/product_tags');
let PhoneMainTop = require('../models/phone_main_top');

let SaleWeb = require('../models/sale_web');
let SaleWebContactSeller = require('../models/sale_web_contact_seller');

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

//Get Main Slider
router.get('/main-slider', function(req, res, next){
  PhoneMainSlider.
  find().
  sort({sort: 'descending'}).
  exec(function (err, slider) {
    let prodArr = [];
    if (err) {
      return res.status(500).send({message: err.message});
    }
    if (slider) {
      slider.forEach(prod => {
        prodArr.push(prod);
      });
    }
    res.send(prodArr);
  });
});

//Get Product Info Using URL
router.get('/product-info-count/:id', function(req, res, next){
  // Products.count({url:req.params.id}, function(err, c) {
  //   if (err) {
  //     return res.status(500).send({message: err.message});
  //   }
  //   res.send(c);
  // });
  Products.count({ url: req.params.id }, function (err, count) {
    if (err) {
       console.log(err);
    }
    res.send({"message":count});
  });
});

router.get('/products-info-count/:id', function(req, res, next){
  Category.count({ url: req.params.id }, function (err, count) {
    if (err) {
       console.log(err);
    }
    res.send({"message":count});
  });
});

//Get Product Info Using URL
router.get('/product-info/:id', function(req, res, next){
  Products.count({ url: req.params.id }, function (err, count) {
    if (err) {
       console.log(err);
    }
    if (count==1) {
  Products.
  findOne({url:req.params.id}).
  select('associate_products').
  exec(function (err, products) {
    if (err) {
      return res.status(500).send({message: err.message});
    }
        if (products){
          let Assoc = products.associate_products;
          // if (Array.isArray(Assoc)) {
          if (Assoc !='') {
            Products.
            findOne({url:req.params.id}).
            populate('associate_products','title url price special_price images',Products).
            populate('desc_entity.entity','title',Entities).
            populate('attribute','title',Attributes).
            exec(function (err, products) {
              if (err) {
                return res.status(500).send({message: err.message});
              }
              res.send(products);
            });
          } else {
            Products.
            findOne({url:req.params.id}).
            populate('desc_entity.entity','title',Entities).
            populate('attribute','title',Attributes).
            exec(function (err, products) {
              if (err) {
                return res.status(500).send({message: err.message});
              }
              res.send(products);
            });
          }
        }
      });
    } else {
      res.send('not');
    }
  });
});

//Get Product Seo
router.get('/product-seo/:id', function(req, res, next){
  Products.count({ url: req.params.id }, function (err, count) {
    if (err) {
       console.log(err);
    }
    if (count==1) {
  Products.
  findOne({url:req.params.id}).
  select('title seo images url'). 
  exec(function (err, products) {
    if (err) {
      return res.status(500).send({message: err.message});
    }
    res.send(products);
  });
} else {
  res.sendStatus(count);
}
});
});

//Get Product Info Using ID
router.get('/product-info-id/:id', function(req, res, next){
  Products.
  findById(req.params.id).
  exec(function (err, products) {
    if (err) {
      return res.status(500).send({message: err.message});
    }
    res.send(products);
  });
});

//Get Product Related
router.get('/product-related/:id', function(req, res, next){
  Products.
  findOne({url:req.params.id}).
  select('category brand attribute').
//  populate('associate_products','title url price special_price images',Products).
  exec(function (err, product) {
    if(product){
    Products.
    find({category:product.category,brand:product.brand,is_web_active: 1,deleted:0}).
    select('price  images title special_price url title').
    where("url").
    ne(req.params.id).
    limit(6).
    exec(function(err, products) {
      let prodArr = [];
      if (err) {
        return res.status(500).send({message: err.message});
      }
      if (products) {
        products.forEach(prod => {
          prodArr.push(prod);
        });
      }
      AttribEntities.
        find({attributes:product.attribute}).
        populate('entities','title identifier input_type',Entities).
        exec((err, ae)=>{
        ProductEntities.
        find({products:product._id}).
        populate('entities','title identifier input_type',Entities).
        exec(function (err, productE) {
          if (err) {
            return res.status(500).send({message: err.message});
          }
          res.send({productE,ae,prodArr});
        });
      });
      //res.send(prodArr);
    });
  } else{

  }
  });
});

//Get All Products
router.get('/products',(req, res, next)=>{
  Products
  .find({is_web_active: 1,deleted: 0})
  // .populate('brand','title url',Brand)
   .populate('desc_entity.entity','title',Entities)
  .select({ title : 1, url: 1, price:1, special_price: 1,category:1, images: 1,brand: 1,stock: 1,seo: 1,desc_entity: 1 })
  .sort({created_at: 'descending'})
  .exec((err, products)=>{
    let prodArr = [];
    if (err) {
      return res.status(500).send({message: err.message});
    } 
    if (products) { 
      products.forEach(prod => {
        prodArr.push(prod);
      });
    }
    res.send(prodArr);
  });
});

//Get All Products Tags
router.get('/all-products-tags/:id',(req, res, next)=>{
  Tags.
  findOne({url:req.params.id}).
  exec((err, tags)=>{
    Products.
    find({ tags: tags.id}).
      exec((err, products)=>{
      let prodArr = [];
      if (err) {
        return res.status(500).send({message: err.message});
      }
      if (products) {
        products.forEach(prod => {
          prodArr.push(prod);
        });
      }
      res.send(prodArr);
    });
  });
});

//Get All Products Tags
router.get('/products-tags',(req, res, next)=>{
  Tags.
  find().
    exec((err, tags)=>{
    let tagArr = [];
    if (err) {
      return res.status(500).send({message: err.message});
    }
    if (tags) {
      tags.forEach(tag => {
        tagArr.push(tag);
      });
    }
    res.send(tagArr); 
  }); 
});

//Get All Products Offer
router.get('/products-offer',(req, res, next)=>{
  Products.find({is_web_active: 1,deleted: 0}).
  where("special_price").
  ne(0).
    exec((err, products)=>{
    let prodArr = [];
    if (err) {
      return res.status(500).send({message: err.message});
    }
    if (products) {
      products.forEach(prod => {
        prodArr.push(prod);
      });
    }
    res.send(prodArr);
  });
});

//Get All Products Offer extra
router.get('/products_offer_extra',(req, res, next)=>{
  Products.find({is_web_active: 1,deleted: 0}).
  select('title url price images special_price ').
  where("special_price").
  ne(0).
  limit(4).
    exec((err, products)=>{
    let prodArr = [];
    if (err) {
      return res.status(500).send({message: err.message});
    }
    if (products) {
      products.forEach(prod => {
        prodArr.push(prod);
      });
    }
    res.send(prodArr);
  });
});

//Get Featured Products
router.get('/product-featured', function(req, res, next){
  PhoneProductsFeatured.
  find({}).
  populate('product','title url price images special_price is_web_active deleted',Products).
  limit(6).
  exec(function (err, featured) {
    if (err) console.log(err);
    let prodArr = [];
    if (err) {
      return res.status(500).send({message: err.message});
    }
    if (featured) {
      featured.forEach(prod => {
        prodArr.push(prod);
      });
    }
    res.send(prodArr);
  });
});

//Get latest Products
router.get('/product-latest', function(req, res, next){
  Products.
  find({is_web_active: 1,deleted: 0}).
  select('title url images special_price price stock').
  sort({_id: 'descending'}).
  limit(6).
  exec(function (err, products) {
    if (err) console.log(err);
    let prodArr = [];
    if (err) {
      return res.status(500).send({message: err.message});
    }
    if (products) {
      products.forEach(prod => {
        prodArr.push(prod);
      });
    }
    res.send(prodArr);
  });
});

//Get Category SEO
router.get('/category-seo/:id', function(req, res, next){
  Category.
  findOne({url:req.params.id}).
  select('title footer_seo seo').
  exec((err,category)=>{
    if (err) {
      console.log(err);
    }
    res.send(category);
  });
});

//Get Category Info
router.get('/category-info/:id', function(req, res, next){
  Category.findOne({url:req.params.id},(err,category)=>{
    if (err) {
      console.log(err);
    }
    res.send(category);
  });
});

//Get Category Products
router.get('/products-category/:id', function(req, res, next){
  Category.findOne({url:req.params.id},(err,category)=>{
    const categoryArr =[];
    if (category) {
    if (category.parent !=0) {
        categoryArr.push(category.id);
    }
        Category.
        find({parent:category.id}).
        distinct('_id').
        exec((err, cat)=>{
          let catArr = [];
            if (err) {
              return res.status(500).send({message: err.message});
            }
            if (cat) {
              cat.forEach(ct => {
                categoryArr.push(ct);
              });
            }
            Category.find()
              .where('parent')
              .in(categoryArr)
              .distinct('_id')
              .exec(function (err, cat3) {
                let cat3Arr = [];
                if (err) {
                  return res.status(500).send({message: err.message});
                }
                if (cat3) {
                  cat3.forEach(cat33 => {
                    categoryArr.push(cat33);
                  });
                }
                // Products.
                // find({is_web_active: 1,deleted: 0}).
                // where('category').
                // in(categoryArr).
                // populate('attribute','title',Attributes).
                // sort({ price : 'ascending'}).
                // select('cost price attribute brand images special_price url title').
                // exec(function (err, products) {
                //   let prodArr = [];
                //   let entArr = [];
                //   if (err) {
                //     return res.status(500).send({message: err.message});
                //   }
                //   if (products) {
                //     products.forEach(prod => {
                //       
                //       prodArr.push(prod);
                //     });
                //   }
                //   res.send(prodArr);
                // });
                res.send(categoryArr);
              });
        });
    }
  });

});

//Get Category Products
router.get('/product-category/:id', function(req, res, next){
  Category.findOne({url:req.params.id},(err,category)=>{
    const categoryArr =[];
    if (category) {
    if (category.parent !=0) {
        categoryArr.push(category.id);
    }
        Category.
        find({parent:category.id}).
        distinct('_id').
        exec((err, cat)=>{
          let catArr = [];
            if (err) {
              return res.status(500).send({message: err.message});
            }
            if (cat) {
              cat.forEach(ct => {
                categoryArr.push(ct);
              });
            }
            
            Category.find()
              .where('parent')
              .in(categoryArr)
              .distinct('_id')
              .exec(function (err, cat3) {
                let cat3Arr = [];
                if (err) {
                  return res.status(500).send({message: err.message});
                }
                if (cat3) {
                  cat3.forEach(cat33 => {
                    cat3.push(cat33);
                  });
                }
                let lastCatArr;
                if (categoryArr.length==1) {
                  lastCatArr =categoryArr;
                } else {
                  lastCatArr = cat3;
                }
                Products.
                find({is_web_active: 1,deleted: 0}).
                where('category').
                in(lastCatArr).
                populate('attribute','title',Attributes).
                sort({ price : 'ascending'}).
                select('cost price attribute brand images special_price url title').
                exec(function (err, products) {
                  let prodArr = [];
                  let entArr = [];
                  if (err) {
                    return res.status(500).send({message: err.message});
                  }
                  if (products) {
                    products.forEach(prod => {
                      
                      prodArr.push(prod);
                    });
                  }
                  res.send(prodArr);
                });
              });
        });

      // Products.
      // find({category: category.id,is_web_active: 1}).
      // //populate('courier','name',Courier).
      // sort({ price : 'ascending'}).
      // select('cost price attribute brand images special_price url title').
      // exec(function (err, products) {
      //   let prodArr = [];
      //   if (err) {
      //     return res.status(500).send({message: err.message});
      //   }
      //   if (products) {
      //     products.forEach(prod => {
      //       prodArr.push(prod);
      //     });
      //   }
      //   res.send(prodArr);
      // });
    } else {

    }
  });

});

//Get Category Products
router.get('/product-category-unique/:id', function(req, res, next){
  Category.findOne({url:req.params.id},(err,category)=>{
    const categoryArr =[];
    if (category) {
    if (category.parent !=0) {
        categoryArr.push(category.id);
    }
        Category.
        find({parent:category.id}).
        distinct('_id').
        exec((err, cat)=>{
          let catArr = [];
            if (err) {
              return res.status(500).send({message: err.message});
            }
            if (cat) {
              cat.forEach(ct => {
                categoryArr.push(ct);
              });
            }
            Category.find()
              .where('parent')
              .in(categoryArr)
              .distinct('_id')
              .exec(function (err, cat3) {
                let cat3Arr = [];
                if (err) {
                  return res.status(500).send({message: err.message});
                }
                if (cat3) {
                  cat3.forEach(cat33 => {
                    cat3Arr.push(cat33);
                  });
                }
                let lastCatArr;
                if (categoryArr.length==1) {
                  lastCatArr =categoryArr;
                } else {
                  lastCatArr = cat3Arr;
                }
                  res.send(lastCatArr);
              });
        });
    } else {

    }
  });

});

//Get Category Products Branded
router.get('/product-category-brand/:id/:brand', function(req, res, next){
  Category.findOne({url:req.params.id},(err,category)=>{
    const categoryArr =[];
    if (category) {
    if (category.parent !=0) {
        categoryArr.push(category.id);
    }
        Category.
        find({parent:category.id}).
        distinct('_id').
        exec((err, cat)=>{
          let catArr = [];
            if (err) {
              return res.status(500).send({message: err.message});
            }
            if (cat) {
              cat.forEach(ct => {
                categoryArr.push(ct);
              });
            }
            Category.find()
              .where('parent')
              .in(categoryArr)
              .distinct('_id')
              .exec(function (err, cat3) {
                let cat3Arr = [];
                if (err) {
                  return res.status(500).send({message: err.message});
                }
                if (cat3) {
                  cat3.forEach(cat33 => {
                    cat3Arr.push(cat33);
                  });
                }
                Products.
                find({is_web_active: 1,deleted: 0, brand: req.params.brand}).
                where('category').
                in(cat3Arr).
                populate('attribute','title',Attributes).
                sort({ price : 'ascending'}).
                select('cost price attribute brand images special_price url title').
                exec(function (err, products) {
                  let prodArr = [];
                  let entArr = [];
                  if (err) {
                    return res.status(500).send({message: err.message});
                  }
                  if (products) {
                    products.forEach(prod => {
                      prodArr.push(prod);
                    });
                  }
                  res.send(prodArr);
                });
              });
        });
    } else {

    }
  });

});

//Get All Brands
router.get('/all-brands', function(req, res, next){
  Products.distinct('brand', function (err, products) {
    if (err) {
      console.log(err);
    }
    Brand.find()
      .where('_id')
      .in(products)
      // .where("logo")
      // .ne(null)
      .exec(function (err, brands) {
        let brandArr = [];
        if (err) {
          return res.status(500).send({message: err.message});
        }
        if (brands) {
          brands.forEach(brand => {
            brandArr.push(brand);
          });
        }
        res.send(brandArr);
      });
  });
});


//Get All Home APi
router.get('/home', function(req, res, next){
  PhoneMainCategory.
  find().
  populate('category','title url',Category).
  populate('products','title url price special_price images',Products).
  populate('brands','title url',Brand).
  exec((err, main)=>{
    if (err) console.log(err);
    let mainArr = [];
    if (err) {
      return res.status(500).send({message: err.message});
    }
    if (main) {
      main.forEach(man => {
          mainArr.push(man);
      });
    }
    PhoneMainCategoryFoot.
    find().
    populate('products','title url price special_price images',Products).
    sort({sort:'1'}).
    exec((err, category)=>{
      if (err) console.log(err);
      let catArr = [];
      if (err) {
        return res.status(500).send({message: err.message});
      }
      if (category) {
        category.forEach(man => {
          catArr.push(man);
        });  
      }
      Blog.
      find({status:1}).
      sort({created_at:'-1'}).
      limit(4).
      exec((err, blog)=>{
      PhoneMainTop.
      find().
      populate('product','title url price special_price',Products).
      exec((err, top)=>{
        if (err) console.log(err);
        let blogArr = [];
        let topArr = [];
        if (err) {
          return res.status(500).send({message: err.message});
        }
        if (blog) {
          blog.forEach(blo => {
              blogArr.push(blo);
          }); 
        }
        if (top) {
          top.forEach(t => {
              topArr.push(t);
          }); 
        }
        res.send({
          top: topArr,
          category:mainArr,
          categoryFoot:catArr,
          blog:blogArr
        });
      });
    });
  }); 
}); 
});

//get Home-Mobile
router.get('/home-mobile', function(req, res, next){
  PhoneMainCategory.
  find().
  select('bottom_image').
  populate('category','title url',Category).
  populate('products','title url price special_price images',Products).
  limit(1).
  exec((err, main)=>{
    if (err) console.log(err);
    let mainArr = [];
    if (err) {
      return res.status(500).send({message: err.message});
    }
    if (main) {
      main.forEach(man => {
          mainArr.push(man);
      });
    }
    Blog.
    find({status:1}).
    limit(2).
    exec((err, blog)=>{
      if (err) console.log(err);
      let blogArr = [];
      if (err) {
        return res.status(500).send({message: err.message});
      }
      if (blog) {
        blog.forEach(blo => {
            blogArr.push(blo);
        });
      }
      res.send({category:mainArr,blog:blogArr});
    }); 
  });
});



//Get Home Category
router.get('/home-category-mobile', function(req, res, next){
  PhoneMainCategory.
  find().
  select('bottom_image').
  populate('category','title url',Category).
  populate('products','title url price special_price images',Products).
  limit(1).
  exec((err, main)=>{
    if (err) console.log(err);
    let mainArr = [];
    if (err) {
      return res.status(500).send({message: err.message});
    }
    if (main) {
      main.forEach(man => {
          mainArr.push(man);
      });
    }
    res.send(mainArr);
  });
});

//Get Home Blog Mobile
router.get('/home-blog-mobile', function(req, res, next){
  Blog.
  find({status:1}).
  limit(2).
  exec((err, blog)=>{
    if (err) console.log(err);
    let blogArr = [];
    if (err) {
      return res.status(500).send({message: err.message});
    }
    if (blog) {
      blog.forEach(blo => {
          blogArr.push(blo);
      });
    }
    res.send(blogArr); 
  });
});

//Get Blog Info
router.get('/blog/:id', function(req, res, next){
  Blog.
  findOne({url:req.params.id}).
  exec((err, blog)=>{
    if (err) console.log(err);
    if (err) {
      return res.status(500).send({message: err.message});
    }
    res.send(blog);
  });
});

//Get Blogs
router.get('/blogs', function(req, res, next){
  Blog.
  find({status: 1}).
  exec((err, blog)=>{
    if (err) console.log(err);
    let blogArr = [];
    if (err) {
      return res.status(500).send({message: err.message});
    }
    if (blog) {
      blog.forEach(blo => {
          blogArr.push(blo);
      });
    }
    res.send(blogArr);
  });
});

//Get Other Blogs
router.get('/blogs-other/:id', function(req, res, next){
  Blog.
  find({status: 1}). 
  where("url").
  ne(req.params.id).
  limit(5).
  exec((err, blog)=>{
    if (err) console.log(err);
    let blogArr = [];
    if (err) {
      return res.status(500).send({message: err.message});
    }
    if (blog) {
      blog.forEach(blo => {
          blogArr.push(blo);
      });
    }
    res.send(blogArr);
  });
});

//Get All Categories
router.get('/all-category', function(req, res, next){
  Category.
  find({}).
  where("visible").
  ne(0).
  sort({_id: 'ascending'}).
  exec(function (err, category) {
    if (err) console.log(err);
    let catArrP = [];
    let catArr = [];
    if (err) {
      return res.status(500).send({message: err.message});
    }
    if (category) {
      category.forEach(cat => {
          catArr.push(cat);  
          if (cat.parent==0) {
            catArrP.push(cat);
          }
      });
    }
    res.send({top:catArrP,all:catArr});
  });
});

router.get('/all-category2', function(req, res, next){
  Category.
  find({}).
  where("visible").
  ne(0).
  sort({_id: 'ascending'}).
  exec(function (err, category) {
    if (err) console.log(err);
    let catArr = [];
    let catArr1 = [];
    let catArr2 = [];
    if (err) {
      return res.status(500).send({message: err.message});
    }
    if (category) { 
      category.forEach(cat => {
        cat["child"]={};
        if (cat.parent==0) {
          catArr1.push(cat);
        }             
      });
      category.forEach(cat => {
        catArr1.forEach(cat1 => { 
          catArr2.push(cat1);
          // if (cat.parent==cat1.main.id) {
          //   catArr1.push({"child1":cat,child:{}});
          // }  
        });         
      });
    } 
    res.send(catArr1);
  });
});

//Get Top Categories
router.get('/category-top', function(req, res, next){
  Category.
  find({parent:0}).
  where("visible").
  ne(0).
  exec(function (err, category) {
    if (err) console.log(err);
    let catArr = [];
    if (err) {
      return res.status(500).send({message: err.message});
    }
    if (category) {
      category.forEach(cat => {
        catArr.push(cat);
      });
    }
    res.send(catArr);
  });
});

//Get Category Brand
router.get('/brand/:id', function(req, res, next){
  Brand.
  findOne({url:req.params.id}).
  exec((err, brand)=>{
    if (err) {
      return res.status(500).send({message: err.message});
    }
    res.send(brand);
  });
    //  Brand.find({url:req.params.id},(err,brand)=>{
    //    res.send(brand)
    //  });
});
//Get Category Brand
router.get('/brand-entity/:id', function(req, res, next){
  // Category.findOne({url:req.params.id},(err,category)=>{
  //   Products.
  //   find({category: category.id,is_web_active: 1}).
  //   distinct('brand').
  //   exec((err, products)=>{
  //     Brand.
  //     find().
  //     where('_id').
  //     in(products).
  //     exec((err, brand)=>{
  //       if (err) console.log(err);
  //       let brandArr = [];
  //       if (err) {
  //         return res.status(500).send({message: err.message});
  //       }
  //       if (brand) {
  //         brand.forEach(bran => {
  //           brandArr.push(bran);
  //         });
  //       }
  //       res.send(brandArr);
  //     });
  //   });
  // });
  Category.findOne({url:req.params.id},(err,category)=>{
    const categoryArr =[];
    if (category) {
    if (category.parent !=0) {
        categoryArr.push(category.id);
    }
        Category.
        find({parent:category.id}).
        distinct('_id').
        exec((err, cat)=>{
          let catArr = [];
            if (err) {
              return res.status(500).send({message: err.message});
            }
            if (cat) {
              cat.forEach(ct => {
                categoryArr.push(ct);console
              });
            }
            Category.find()
              .where('parent')
              .in(categoryArr)
              .distinct('_id')
              .exec(function (err, cat3) {
                let cat3Arr = [];
                if (err) {
                  return res.status(500).send({message: err.message});
                }
                if (cat3) {
                  cat3.forEach(cat33 => {
                    cat3.push(cat33);
                  });
                }
                Products.
                find({is_web_active: 1,deleted: 0}).
                where('category').
                in(categoryArr).
                distinct('brand').
                exec(function (err, products) {
                  Brand.
                      find().
                      where('_id').
                      in(products).
                      exec((err, brand)=>{
                        if (err) console.log(err);
                        let brandArr = [];
                        if (err) {
                          return res.status(500).send({message: err.message});
                        }
                        if (brand) {
                          brand.forEach(bran => {
                            brandArr.push(bran);
                          });
                        }
                        res.send(brandArr);
                      });
                });
              });
        });
    } else {
      res.send(null);
    }
  });

});

//Get Brand Info By ID
router.get('/brands-info/:id', function(req, res, next){
  Brand.
  findById(req.params.id).
  exec((err,brand)=>{
    if (err) console.log(err);
    res.send(brand);
  });
});

//Get Brand Entity
router.post('/get-brands-entity', function(req, res, next){
  res.send('get-brands');
});

//Get Category Entity
router.get('/category-entity/:id', function(req, res, next){
   Category.findOne({url:req.params.id},(err,category)=>{
     Products.
     find({category: category.id,is_web_active: 1,deleted: 0}).
     //distinct('attribute')
     exec(function (err, products) {
       if (err) console.log(err);
       let prodArr = [];
       if (err) {
         return res.status(500).send({message: err.message});
       }
       if (products) {
         products.forEach(prod => {
           prodArr.push(prod);
         });
       }
       res.send(prodArr);
     });
   });
});

//Search Products
router.get('/products_search/:id',function(req, res,next){
  //var regex = new RegExp(req.query["term"], 'i');
  var reg=new RegExp(req.params.id, 'i');
  Products.
  find({title:reg,is_web_active:1,deleted: 0}).
  //select('price images special_price url title').
  exec(function (err, product) {
    if (err) console.log(err);
    let prodArr = [];
    if (err) {
      return res.status(500).send({message: err.message});
    }
    if (product) {
      product.forEach(prod => {
        prodArr.push(prod);
      });
    }
    res.send(prodArr);
  });
});


////////////////////////////////////////////////////////
//////////////API Category ////////////////////////////
//////////////////////////////////////////////////////
//Get Top Categories
router.get('/pg-category/:id', function(req, res, next){
  Category.
  find({url:req.params.id,parent:0}).
  exec(function (err, category) {
    if (err) console.log(err);
    let catArr = [];
    if (err) {
      return res.status(500).send({message: err.message});
    }
    if (category) {
      category.forEach(cat => {
        catArr.push(cat);
      });
    }
    res.send(catArr);
  });
});

/////////////////////////////////////////////////////////////
////////////API Blog INFO////////////////////////////////
/////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////
////////////API Orders INFO////////////////////////////////
/////////////////////////////////////////////////////////////

//Get Shipping
router.get('/shipping', function(req, res, next){
  PhoneMainShipping.
  find({}).
  populate('location','location',DeliveryLocation).
  exec(function (err, shipping) {
    if (err) console.log(err);
    let delArr = [];
    if (err) {
      return res.status(500).send({message: err.message});
    }
    if (shipping) {
      shipping.forEach(del => {
        delArr.push(del);
      });
    }
    res.send(delArr);
  });
});

//Get Shipping Amount
router.get('/shipping-amount/:id', (req, res, next)=>{
  PhoneMainShipping.findById(req.params.id,'amount',(err,fee)=>{
     let amount = fee.amount;
    res.send(fee);
  });
});

//Get Delivery
router.get('/delivery-location', function(req, res, next){
  DeliveryLocation.
  find({}).
  exec(function (err, delivery) {
    if (err) console.log(err);
    let delArr = [];
    if (err) {
      return res.status(500).send({message: err.message});
    }
    if (delivery) {
      delivery.forEach(del => {
        delArr.push(del);
      });
    }
    res.send(delArr);
  });
});

//Get Courier
router.get('/courier/:id', function(req, res, next){
  CourierLocation.
  find({branch:req.params.id}).
  populate('courier','name',Courier).
  exec(function (err, location) {
    if (err) console.log(err);
    let locArr = [];
    if (err) {
      return res.status(500).send({message: err.message});
    }
    if (location) {
      location.forEach(loc => {
        locArr.push(loc);
      });
    }
    res.send(locArr);
  });
});

//Get Courier
router.get('/courier-fee/:id', function(req, res, next){
  CourierLocation.findById(req.params.id,(err,fee)=>{
    res.send(fee);
  });
});

//Post Contact Seller
router.post('/contact-seller', function(req, res, next){
  let sale= new SaleWebContactSeller();
  sale.name = req.body.name;
  sale.email = req.body.email;
  sale.phone = req.body.phone;
  sale.message = req.body.message;
  sale.product = req.body.product_id;
  sale.status = 'raw';

  sale.save(function(err){
    if(err){
      res.send('Err',err);
    }
      res.send("Success");
  });
});

//Post Order
router.post('/order', function(req, res, next){
  let sale= new SaleWeb();
  sale.first_name = req.body.first_name;
  sale.last_name = req.body.last_name;
  sale.email = req.body.email;
  sale.phone = req.body.phone;
  sale.status = 'raw';
  sale.cart = req.body.cart;
  sale.delivery_location = req.body.delivery_location;
  sale.shipping = req.body.shipping;

  sale.save(function(err){
    if(err){
      res.send({"message":err});
    }
      res.send({"message":"Success"});
  });

});

module.exports = router;


function _getProductEntity(id){
  // ProductEntities.
  // find({products:id}).
  // exec(function (err, entity) {
  //   Entity :entity
  // });
  return ProductEntities.find({ products:id }).exec();
}
