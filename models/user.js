const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require ('../config/database');
const timestamps = require('mongoose-timestamp');

//User Schema
const UserSchema = mongoose.Schema({
  first_name: {
      type: String,
      default:''
  },
  middle_name: {
      type: String,
      default:''
  },
  last_name: {
      type: String,
      default:''
  },
  username:{
      type:String,
      unique: true,
      required: true
  },
  national_id: {
    type: Number,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    unique:true,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default:''
  },
  gender:{
    type: String,
    required: true
  }
});

UserSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const User = module.exports = mongoose.model('MainUser', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
    });
}
