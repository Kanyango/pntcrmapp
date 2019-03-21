const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

//Blog Schema
const BlogCategorySchema = mongoose.Schema({
  title:{
    type: String,
    required:true
  },
  url:{
    type: String,
    required:true,
    unique: true
  }
});

BlogCategorySchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const BlogCategory = module.exports = mongoose.model('blog-category', BlogCategorySchema);
