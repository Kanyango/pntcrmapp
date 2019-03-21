const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require ('../config/database');
const timestamps = require('mongoose-timestamp');

//User Web Schema
const UserWebSchema = mongoose.Schema({
  username: {
      type: String,
      default:''
  },
  first_name: {
      type: String,
      default:''
  },
  last_name: {
      type: String,
      default:''
  },
  email: {
        type: String,
        unique: true,
        required: true
    },
  password: {
        type: String,
        required: true
    }
});

UserWebSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const UserWeb = module.exports = mongoose.model('user_web', UserWebSchema);


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
	UserWeb.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	UserWeb.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
    });
}
