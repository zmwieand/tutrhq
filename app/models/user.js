var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  first_name: String,
  last_name: String,
  nickname: String,
  email_address: { type: String, required: true, unique: true },
  contact: String,
  longitude: Number,
  latitude: Number,
  courses: [],
  pic: String,
  role: String,
  rating: Number,
  major: String,
  hourly_rate: Number,
  is_active: Boolean,
  transactions: [],
  session : {
      email: String,
      state: String,
      session_start: Number,
      session_end: Number,
  }
});

userSchema.statics.findByEmail = function(email_address, cb) {
  this.findOne({ email_address: email_address }, function(err, user) {
    if (err) return cb(err);
    if (user) return cb(null, user);
    return cb();
  });
};

userSchema.statics.findActive = function(course, cb) {
  this.find({is_active: true}, function(err, user){
    if (err) return cb(err);
    if (user) return cb(null, user);
    return cb();
  });
};

var User = mongoose.model('User', userSchema);

module.exports = User;
