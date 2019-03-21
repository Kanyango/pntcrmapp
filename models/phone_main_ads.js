const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const bcrypt = require('bcryptjs');
const config = require ('../config/database');
const timestamps = require('mongoose-timestamp');

//Phone Main Ads Schema
const PhoneMainAdsSchema = mongoose.Schema({
  ad_1: {
    image_1:{
      img:{type: String,required: true},
      link:{type: String,required: true}
    },
    image_2:{
      img:{type: String,required: true},
      link:{type: String,required: true}
    }
  },
  ad_2: {
    image_1:{
      img:{type: String,required: true},
      link:{type: String,required: true}
    },
    image_2:{
      img:{type: String,required: true},
      link:{type: String,required: true}
    },
    image_3:{
      img:{type: String,required: true},
      link:{type: String,required: true}
    },
  },
  ad_3: {
    image_1:{
      img:{type: String,required: true},
      link:{type: String,required: true}
    },
    image_2:{
      img:{type: String,required: true},
      link:{type: String,required: true}
    }
  }
});

PhoneMainAdsSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const PhoneMainAds = module.exports = mongoose.model('phone_main_ads', PhoneMainAdsSchema);
