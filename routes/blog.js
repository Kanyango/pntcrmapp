const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const slugify = require('slugify');
const formidable = require('formidable');

// const multerConf ={
//   storage : multer.diskStorage({
//     destination: function (req, file, callback) {
//         callback(null, './public/images/uploads/');
//       },
//       filename: function (req, file, callback) {
//         const ext = file.mimetype.split('/')[1];
//         next(null,file.fieldname + '-' + Date.now() + '.'+ext);
//       }
//   }),
//   fileFilter: function(req, file, next){
//     if(!file){
//       next();
//     }
//     const image = file.mimetype.startwith('image/');
//     if(image){
//       next(null, true);
//     } else{
//       next({message:"File type not supported"}, false);
//     }
//   }
// };

let User = require('../models/user');
let Blog = require('../models/blog');

router.get('/', function(req, res, next){
  Blog.find({},function(err, blog){
    res.render('pages/blog/index',{
      blog:blog
    });
  });
});

//CREATE NEW Blog
router.get('/add', function(req, res, next){
    res.render('pages/blog/add');
});

//SAVE NEW Blog
router.post('/add',(req, res)=>{
  let title = req.body.title;
  let short_content = req.body.short_content;
  let full_content = req.body.full_content;
  let seo_title = req.body.seo-title;
  let keywords = req.body.keyword;
  let description = req.body.description;
  let category = req.body.category;

  // Validation`
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('short_content', 'Short Content is Required').notEmpty();
  req.checkBody('full_content', 'Full Content is Required').notEmpty();

  req.asyncValidationErrors().then(() => {
    //no errors, create user
    let blog= new Blog();
    blog.title = title;
    blog.url = slugify(req.body.title,{remove: /[$*_+~.()'"!:@]/g,lower: true});
    blog.short_content = short_content;
    blog.category = category;
    blog.full_content = full_content;
    blog.seo.title = seo_title;
    blog.seo.keywords = keywords;
    blog.seo.description = description;
    blog.user = req.user.id;

    blog.save(function(err){
      if(err){
        req.flash('danger','Blog not Created');
        res.redirect('/blog/add');
        console.log(err);
        return;
      }

        req.flash('success','Blog Created');
        res.redirect('/blog');
    });

  }).catch((errors) => {

      if(errors) {
        for (var i = 0; i < errors.length; i++) {
          var param = errors[i].param;
          var msg = errors[i].msg;
          req.flash('danger', errors[i].msg);
        }
        res.redirect('/blog/add');
        return;
      };
  });
});

//Update Blog Status
router.post('/blog_status', (req, res) => {

     let query = {_id: req.body.id};
     let new_status =req.body.status;

      Blog.update(query,{ status: new_status}).exec();

      req.flash('success','Blog Status Updated');
      res.redirect('/blog/view/'+req.body.id);
});

//Blog View FROM ID
router.get('/view/:id', function(req, res, next){
  Blog.findById(req.params.id,function(err, blog){
    res.render('pages/blog/view',{
      blog:blog
    });
  });
});

//Blog Edit Info
router.get('/edit-info/:id', function(req, res, next){
  Blog.findById(req.params.id,function(err, blog){
    res.render('pages/blog/edit-info',{
      blog:blog
    });
  });
});

//Update Blog info
router.post('/edit-info/:id', (req, res) => {

     let query = {_id: req.params.id};
     let title = req.body.title;
     let url = req.body.url;
     let short_content = req.body.short_content;
     let full_content = req.body.full_content;
     let seo_title = req.body.seo-title;
     let keyword = req.body.keyword;
     let description = req.body.description;
     let category = req.body.category;
     let thumb_image = req.body.thumb_image;
     let main_image = req.body.main_image;

    Blog.updateMany(
      { _id:req.params.id },
      {
        $set:{
           title: title ,
           url: url ,
           short_content: short_content ,
           full_content: full_content,
           category: category,
           main_image: main_image,
           thumb_image,thumb_image,
           seo:{
             title: seo_title,
             keywords: keyword ,
             description: description
           } }}, { multi: true }).exec(function(err){
             if(err){
               req.flash('danger','Blog not Created');
               res.redirect('/blog/edit/'+req.params.id);
               console.log(err);
               return;
             }
                res.redirect('/blog/view/'+req.params.id);
           });
});

//Blog Edit Info
router.get('/image/:id', function(req, res, next){
  Blog.findById(req.params.id,function(err, blog){
    res.render('pages/blog/image',{
      blog:blog
    });
  });
});

// router.post('/image/:id',multer(multerConf).single('photo'), function (req, res, next) {
//   if(req.files){
//     console.log(req.files);
//     req.body.photo = req.file.filename;
//   }
// });

// router.post('/blog-thumbnail-image/:id', function(req, res) {
//   if (!req.files)
//     return res.status(400).send('No files were uploaded.');
//
//   // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
//   let sampleFile = req.files.sampleFile;
//
//   // Use the mv() method to place the file somewhere on your server
//   sampleFile.mv(__dirname+'/../public/images/blog-file.jpg', function(err) {
//     if (err)
//       return res.status(500).send(err);
//
//     res.send('File uploaded!');
//   });
// });


module.exports = router;
