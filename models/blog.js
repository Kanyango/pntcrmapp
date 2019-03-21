const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const timestamps = require('mongoose-timestamp');

//Blog Schema
const BlogSchema = mongoose.Schema({
  title:{
    type: String,
    required:true
  },
  url:{
    type: String,
    required:true,
    unique: true
  },
  short_content:{
    type: String,
    required:true
  },
  full_content:{
    type: String,
    required:true
  },
  thumb_image:{
    type: String,
    default:''
  },
  main_image:{
    type: String,
    default:''
  },
  status:{
    type: Number,
    default:0
  },
  user: {
    type: ObjectId,
    ref: 'User'
  },
  seo:{
    keywords:{type:String, default:''},
    description:{type:String, default:''}
  },
  tags:{
    type: Array,
    default: ''
  },
  category:{
    type: String,
    default: ''
  }
});

BlogSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const Blog = module.exports = mongoose.model('blog', BlogSchema);
