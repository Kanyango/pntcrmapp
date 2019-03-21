const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

let User = require('../models/user');

router.get('/', function(req, res, next){
  User.find({},function(err, users){
      res.render('pages/user/index',{
        users: users
      });
  });
});

//Add User Form
router.get('/add', function(req, res, next){
  res.render('pages/user/add');
});

//Add User Route
router.post('/add', function(req,res){
  const first_name = req.body.first_name;
  const middle_name = req.body.middle_name;
  const last_name = req.body.last_name;
  const email = req.body.email;
  const phone = req.body.phone;
  const national_id = req.body.national_id;
  const gender = req.body.gender;
  const role = req.body.role;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  //Get Errors
  let errors = req.getValidationResult();

  // if (errors) {
  //   //console.log(first_name);
  //
  //   res.render('pages/driver/add',{
  //     errors: errors
  //   });
  // } else {
    let user= new User({
      first_name:first_name,
      middle_name : middle_name,
      last_name:last_name,
      email:email,
      phone:phone,
      national_id: national_id,
      gender: gender,
      role: role,
      username: username,
      password: password
    });
    console.log(user);

    //driver.password = req.body.password;

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(user.password, salt, function(err, hash){
        if (err) {
          console.log(err);
        }
        user.password = hash;
        user.save(function(err){
          if (err) {
            console.log(err);
          } else {
            req.flash('success', 'Staff is now Registered and can log in');
            res.redirect('/user');
          }
        });
      });
    });
  //}
});

//View User Info
router.get('/view/:id', function(req, res, next){
  User.findById({_id:req.params.id},function(err, user){
      res.render('pages/user/view',{
        user: user
      });
  });
});

//Edit User Form
router.get('/edit/:id', function(req, res, next){
  User.findById({_id:req.params.id},function(err, user){
      res.render('pages/user/edit',{
        user: user
      });
  });
});

//Post  User Edit
router.post('/edit/:id', function(req,res){
  const first_name = req.body.first_name;
  const middle_name = req.body.middle_name;
  const last_name = req.body.last_name;
  const email = req.body.email;
  const phone = req.body.phone;
  const national_id = req.body.national_id;
  const gender = req.body.gender;
  const role = req.body.role;

  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();

  //Get Errors
  let errors = req.getValidationResult();

  // if (errors) {
  //   //console.log(first_name);
  //
  //   res.render('pages/driver/add',{
  //     errors: errors
  //   });
  // } else {
    User.updateMany({ _id:req.params.id },{ $set:{ first_name:first_name,middle_name : middle_name,last_name:last_name, email:email,phone:phone,national_id: national_id,gender: gender,role: role }}, { multi: true }).exec();
       res.redirect('/user/');

  //}
});

//Edit User Form
router.get('/edit-log/:id', function(req, res, next){
  User.findById({_id:req.params.id},function(err, user){
      res.render('pages/user/edit-log',{
        user: user
      });
  });
});

//Post  User Edit
router.post('/edit-log/:id', function(req,res){
  let username = req.body.username;
  let password = req.body.password;
  let password2 = req.body.password2;

  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(password, salt, function(err, hash){
      if (err) {
        console.log(err);
      }
      password = hash;
      User.updateMany({ _id:req.params.id },{ $set:{ password:password,username : username }}, { multi: true }).exec();
         res.redirect('/user/view/'+req.params.id);
    });
  });


});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Invalid Username/Password'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
        return done(null, false, {message: 'Invalid Username/Password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/login',failureFlash: true}),
  function(req, res) {
    req.flash('success_msg','You are logged in');
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/login');
});

module.exports = router;
