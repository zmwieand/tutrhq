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

schoolSchema.statics.findBySchool = function(school_name, cb){
  this.findOne({instnm: school_name},function(err,school){
    if(err) {
      return cb(err);
    }
    if(school){      return cb(null,school);
    }

    return cb();
  });
};

// the schema is useless so far
// we need to create a model using it
var School = mongoose.model('School', schoolSchema);

// make this available to our users in our Node applications
module.exports = School;
//
