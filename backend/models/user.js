// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  first_name: String,
  last_name: String,
  email_address: { type: String, required: true, unique: true },
  contact: String,
  courses: [],
  pic: String,
  role: String,
  rating: Number,
  major: String,
  hourly_rate: Number,
  transactions: []
});

// the schema is useless so far
// we need to create a model using it


/*   
    ==> create
    ==> find
    ==> remove
    ==> update
*/

userSchema.statics.findByEmail = function(email_address, cb) {
  this.findOne({ email: email_address }, function(err, user) {
    if (err) return cb(err);
    if (user) return cb(null, user);
    return cb();
  });
};


var User = mongoose.model('User', userSchema);


// make this available to our users in our Node applications
module.exports = User;



