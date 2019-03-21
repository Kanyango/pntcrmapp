const express = require('express');
const router = express.Router();
const json2csv = require('json2csv');
const csv = require('fast-csv');
const mongoose = require('mongoose');

let Inquiry = require('../models/inquiry');
let Users = require('../models/user');
let Client = require('../models/client');
let Reminder = require('../models/reminder');
let ReminderInquiry = require('../models/reminder_inquiry');
let SaleWebContactSeller = require('../models/sale_web_contact_seller');
let Products = require('../models/products');

router.get('/', function(req, res, next){
  Inquiry.find({})
  .populate('user','first_name last_name',Users)
  .exec((err, query)=>{
    SaleWebContactSeller.
      find({})
      .populate('product','title',Products)
      .sort({"created_at": -1})
      .exec((err,saleCont)=>{
      res.render('pages/inquiry/index',{
        query:query,
        saleCont: saleCont
      });
    });
  });
});

router.get('/view/:id', function(req, res, next){
  Inquiry.findById(req.params.id,(err, query)=>{
    ReminderInquiry.find({},(err,rInquiry)=>{
      Reminder.find({},(err,reminder)=>{
        Client.find({},(err,client)=>{
          res.render('pages/inquiry/view',{
            query:query,
            client: client,
            rInquiry: rInquiry,
            reminder: reminder
          });
        });
      });
    });
  });
});

router.get('/add', function(req, res, next){
  res.render('pages/inquiry/add');
});


//SAVE NEW Inquiry
router.post('/add', function(req, res){
  let inquiry= new Inquiry();
  let client = new Client();

  client.first_name = req.body.first_name;
  client.last_name = req.body.last_name;
  client.phone = req.body.phone;
  client.email = req.body.email;
  inquiry.status = "Open";
  inquiry.user = req.user.id;
  inquiry.query = req.body.query;

if(req.body.id){
  inquiry.client = req.body.id;
  inquiry.save(function(err, new_q){
    let newId = new_q._id;
    if(err){
      req.flash('danger','Inquiry not Created');
      console.log(err);
      return;
    } else{
      if(req.body.reminder !=''){
        let reminder = new Reminder();
        reminder.date = req.body.reminder;
        reminder.user = req.user.id;
        reminder.save((err,new_r)=>{
          let newR = new_r._id;
          if (err) {
            req.flash('danger','Reminder not Created');
            console.log(err);
            return;
          } else {
            let rInquiry = new ReminderInquiry();
            rInquiry.reminder = newR;
            rInquiry.inquiry = newId;
            rInquiry.save((err)=>{
              if (err) {
                req.flash('danger','Inquiry Reminder not Created');
                console.log(err);
                return;
              }
            });
          }
        });
      }
      req.flash('success','Inquiry Created');
      res.redirect('/inquiry/view/'+newId);
    }
  });
}else{
  client.save(function(err, new_client){
    inquiry.client = new_client._id;
    inquiry.save(function(err, new_q){
      let newId = new_q._id;
      if(err){
        req.flash('danger','Inquiry not Create');
        console.log(err);
        return;
      } else{
        if(req.body.reminder !=''){
          let reminder = new Reminder();
          reminder.date = req.body.reminder;
          reminder.user = req.user.id;
          reminder.save((err,new_r)=>{
            let newR = new_r._id;
            if (err) {
              req.flash('danger','Reminder not Created');
              console.log(err);
              return;
            } else {
              let rInquiry = new ReminderInquiry();
              rInquiry.reminder = newR;
              rInquiry.inquiry = newId;
              rInquiry.save((err)=>{
                if (err) {
                  req.flash('danger','Inquiry Reminder not Created');
                  console.log(err);
                  return;
                }
              });
            }
          });
        }
        req.flash('success','Inquiry Created');
        res.redirect('/inquiry/view/'+newId);
      }
    });
  });
}

});

//Update Inquiry Status
router.post('/inquiry_status', (req, res) => {

     let query = {_id: req.body.id};
     let new_status =req.body.status;

      Inquiry.update(query,{ status: new_status}).exec();

      req.flash('success','Inquiry Status Updated');
      res.redirect('/inquiry/view/'+req.body.id);
});

//Edit
router.get('/edit/:id', function(req, res, next){
  Inquiry.findById(req.params.id,(err, query)=>{
    ReminderInquiry.find({},(err,rInquiry)=>{
      Reminder.find({},(err,reminder)=>{
        Client.findById(query.client,(err,client)=>{
          res.render('pages/inquiry/edit',{
            query:query,
            client: client,
            rInquiry: rInquiry,
            reminder: reminder
          });
        });
      });
    });
  });
});

//Update Inquiry
router.post('/edit/:id', (req, res) => {

     //let query = {_id: req.body.id};
console.log(req.body);
      Inquiry.update({ _id:req.params.id },{ query: req.body.query}).exec();
      if (req.body.reminder !='') {
        Reminder.update({_id: req.body.reminder_id},{ date: req.body.reminder }).exec();
      }


      req.flash('success','Inquiry Updated');
      res.redirect('/inquiry/view/'+req.params.id);
});


router.get('/web_inquery_view/:id',(req, res, next)=>{
  SaleWebContactSeller.
  findById(req.params.id).
  populate('product','title',Products).
  exec((err,salCont)=>{
    res.render('pages/ajax/web_inquery_view',{
      salCont: salCont
    });
  });
});

router.post('/edit_web/:id', (req, res) => {

  let query = {_id: req.params.id};
  status =req.body.status;
  note =req.body.note;

  SaleWebContactSeller.updateMany(query,{ $set:{ status: status , note: note }}, { multi: true }).exec();
      res.redirect('/inquiry');
});

module.exports = router;
