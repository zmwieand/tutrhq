//this was called schoolList in my other app


// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var schoolSchema = new Schema({
  instnm: String,
  count: Number,
  activeSchool: Boolean,


});

// schoolSchema.statics.incrementCount = function() {
//   // add some stuff to the users name
//   this.count = this.count + 1;
//   newUser.save(function(err) {
//      if (err) throw err;
//  });
//
//   return this.count;
// };

schoolSchema.statics.findBySchool = function(school_name, cb){
  console.log("Find: " + school_name);
  this.findOne({instnm: school_name},function(err,school){
    console.log("School: " + school);
    if(err) {
      console.log("there was an error!");
      return cb(err);
    }
    if(school){
      console.log(school.count);
      console.log(school.instnm);
      return cb(null,school);
    }

    console.log("nothing happened");
    return cb();
  });
};

// the schema is useless so far
// we need to create a model using it
var School = mongoose.model('School', schoolSchema);

// make this available to our users in our Node applications
module.exports = School;
