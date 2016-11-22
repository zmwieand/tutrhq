// added this to routs/index.js in tutrhq

var express = require('express');
var router = express.Router();
var School = require('../models/schoolList');


router.post('/schools', function(req, res, next) {
    User.findBySchool(req.body['univeristy'], function(err, school) {
        if (school) {
          school.count = school.count +1;
        }
        user.save(function(err) {
            if (err) return err;
        });
        res.redirect("/users");
    });
});



// router.get('/',function(req,res,next){
//   User.findBySchool(rew.user._json.school,function(err,user){
//     if(user && user.available == true){
//       //go to school available page
//     }
//     else{
//       res.render(err, {
//         message: "tutr is not at your school, to change that ....."
//       });
//     }
//   });
// });


module.exports = router;
