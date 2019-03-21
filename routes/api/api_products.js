// const express = require('express');
// const router = express.Router();
//
// let User = require('../../models/user');
// let Client = require('../../models/client');
// let Sale = require('../../models/sale');
// let Repair = require('../../models/repair');
// let RepairProducts = require('../../models/repair_products');
// let Inquiry = require('../../models/inquiry');
// let Vendor = require('../../models/vendor');
// let Products = require('../../models/products');
// let SaleProducts = require('../../models/sale_products');
// let PaymentClient = require('../../models/payment_client');
// let ProductsVendor = require('../../models/products_vendor');
// let CollectedProductsVendor = require('../../models/collected_product_vendor');
// let CollectedProductsVendorInfo = require('../../models/collected_product_vendor_info');
//
// ////////////////////////////////////////////////////////////////////
// ///////// Products API ////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
//
// //Products View
// router.get('/products/view/:id', function(req, res, next){
//   Products.findOne({url:req.params.id}, function(err, products){
//     Brand.findById(products.brand,(err,brand)=>{
//       Category.findById(products.category,(err,category)=>{
//         Category.find({},(err,allcategory)=>{
//           ProductEntities.find({products:products.id},(err,p_entity)=>{
//             Entities.find({},(err,entity)=>{
//               AttribEntities.find({},(err,a_entity)=>{
//                 res.render('pages/products/view',{
//                   products: products,
//                   brand: brand,
//                   category: category,
//                   allcategory: allcategory,
//                   p_entity: p_entity,
//                   entity: entity,
//                   a_entity: a_entity
//                 });
//               });
//             });
//           });
//         });
//       });
//     });
//   });
// });
