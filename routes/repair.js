const express = require('express');
const router = express.Router();

let Client = require('../models/client');
let Repair = require('../models/repair');
let RepairSale = require('../models/repair_sale');
let RepairProducts = require('../models/repair_products');
let RepairPayment = require('../models/repair_payment');
let Reminder = require('../models/reminder');
let ReminderRepair = require('../models/reminder_repair');

router.get('/', function(req, res, next){
  Repair.find({},(err,repair)=>{
    RepairProducts.find({},(err,repairP)=>{
      Client.find({},(err,client)=>{
        res.render('pages/repair/index',{
          repair:repair,
          client: client,
          repairP: repairP
        });
      });
    });
  });
});

//Add New Repair Info
router.get('/add',(req, res, next)=>{
  res.render('pages/repair/add');
});

//Save Repair Info
router.post('/add',(req,res)=>{
  let repair = new Repair();
  let client = new Client();

  client.first_name = req.body.first_name;
  client.last_name = req.body.last_name;
  client.phone = req.body.phone;
  client.email = req.body.email;
  repair.status = 'Open';

  const product = req.body.product;
  const issue = req.body.issue;
  const imei = req.body.imei;

if(req.body.id){
  repair.client = req.body.id;
  //console.log(req.body);
  repair.save(function(err, n_repair){
    let repairId = n_repair._id;
    console.log(repairId);
    if(err){
      req.flash('danger','Repair not Create');
      console.log(err);
      return;
    } else{

      for (var i = 0; i < product.length; i++) {
        let repairP= new RepairProducts();
           repairP.repair= repairId;
           repairP.title = product[i];
           repairP.imei = imei[i];
           repairP.issue = issue[i];
           repairP.status = 'in store';
           repairP.cost = 0;
           repairP.save(function(err){
             if(err){
               console.log(err);
             }
           });
      }
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
            let rInquiry = new ReminderRepair();
            rInquiry.reminder = newR;
            rInquiry.repair = repairId;
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
      req.flash('success','Repair Created');
      res.redirect('/repair/');
    }
  });
} else{
  client.save(function(err, new_client){
    repair.client = new_client.id;
    repair.save(function(err, n_repair){
      let repairId = n_repair._id;
      console.log(repairId);
      if(err){
        req.flash('danger','Repair not Create');
        console.log(err);
        return;
      } else{

        for (var i = 0; i < product.length; i++) {
          let repairP= new RepairProducts();
             repairP.repair= repairId;
             repairP.title = product[i];
             repairP.imei = imei[i];
             repairP.issue = issue[i];
             repairP.status = 'in store';
             repairP.cost = 0;
             repairP.save(function(err){
               if(err){
                 console.log(err);
               }
             });
        }
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
              let rInquiry = new ReminderRepair();
              rInquiry.reminder = newR;
              rInquiry.repair = repairId;
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

        // req.flash('success','Repair Created');
        // res.redirect('/repair/');
      }
    });
  });
}

});

//View Repair Info
router.get('/view/:id',(req, res, next)=>{
  Repair.findById({_id:req.params.id},(err,repair)=>{
    RepairProducts.find({repair:req.params.id},(err,products)=>{
      RepairPayment.find({repair:req.params.id},(err, payment)=>{
        Client.find({},(err, client)=>{
          Reminder.find({},(err,reminder)=>{
            ReminderRepair.find({},(err,reminderP)=>{
              res.render('pages/repair/view',{
                repair: repair,
                products: products,
                payment: payment,
                client: client,
                reminder: reminder,
                reminderP: reminderP
              });
            });
          });
        });
      })
    });
  });
});

//Update Repair Info
router.post('/edit/:id', (req, res) => {
     let first_name =req.body.first_name;
     let last_name =req.body.last_name;
     let phone =req.body.phone;
     let status = req.body.status;
     let email = req.body.email;
      Repair.updateMany({ _id:req.params.id },{ $set:{ first_name: first_name , last_name: last_name , phone: phone,status:status, email:email }}, { multi: true }).exec();
         res.redirect('/repair/view/'+req.params.id);
});

//Update Product Repair
router.post('/edit_product/:id', (req, res) => {
     let query = {_id: req.params.id};
      let title =req.body.title;
      imei =req.body.imei;
      cost =req.body.cost;
      status = req.body.status;
      issue = req.body.issue;
      RepairProducts.updateMany({ _id:req.params.id },{ $set:{ title: title , imei: imei , cost: cost,status:status, issue:issue }}, { multi: true }).exec();
         res.redirect('/repair/view/'+req.body.id);
});

//Save Repair Info
router.post('/repair_payment/:id',(req,res)=>{
  let pay = new RepairPayment();
  pay.repair = req.params.id;
  pay.amount = req.body.amount;
  pay.save(function(err){
    if(err){
      req.flash('danger','Repair Payment not Done');
      console.log(err);
      return;
    }
      req.flash('success','Repair Created');
      res.redirect('/repair/view/'+req.params.id);
  });

});

//AJAX call

//EDIT Repair Info
router.get('/edit/:id',(req,res,next)=>{
  Repair.findById({_id:req.params.id},(err,repair)=>{
    res.render('pages/repair/edit',{
      repair: repair
    });
  });
});

//EDIT Product Repair
router.get('/edit_product/:id',(req,res,next)=>{
  RepairProducts.findById({_id:req.params.id},(err,products)=>{
    res.render('pages/repair/edit_product',{
      products: products
    });
  });
});

//Get Payment Repair
router.get('/repair_payment/:id',(req,res,next)=>{
    res.render('pages/repair/repair_payment',{
      payment : req.params.id
    });
});
module.exports = router;
