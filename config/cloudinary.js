var cloudinary = require('cloudinary');
const global = require('./global');

cloudinary.config({ 
    cloud_name: global.CLOUD_NAME, 
    api_key: global.CLOUDINARY_API_KEY, 
    api_secret: global.CLOUDINARY_API_SECRET 
  });

module.exports.cloudinary = cloudinary;