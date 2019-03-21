const express = require('express');
const router = express.Router();
const json2csv = require('json2csv');
const csv = require('fast-csv');
const mongoose = require('mongoose');

let Products = require('../models/products');

router.get('/', function(req, res, next){
  Products.find({},(err, products)=>{
    res.render('pages/import/index',{
      products:products
    });
  });
});

router.post('/products', function(req, res, next){
  var productsFile = req.files.file;

	var products = [];

	csv.fromString(productsFile.data.toString(), {
		 headers: true,
     delimiter:",",
     quote:'"',
		 ignoreEmpty: true
	 })
	 .on("data", function(data){
		 data['_id'] = new mongoose.Types.ObjectId();

		 products.push(data);
	 })
	 .on("end", function(){
     console.log(products);
    // products.save(function(err, documents) {
    for(var i = 0; i < products.length; i++){
      Products.create(products[i], function(err, documents) {
			if (err) throw err;


		 });
   }
   req.flash('success','Import added Successfully');
   res.redirect('/import');
});
});

module.exports = router;
