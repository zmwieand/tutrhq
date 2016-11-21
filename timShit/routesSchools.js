var express = require('express');
var router = express.Router();
var School = require('../models/schoolList');

/* GET home page. */
router.get('/', function(req, res, next) {
    var newSchool = new School({
        instnm: "University at Buffalo"
    });
    newSchool.save(function(err) {
        if (err) throw err;
    });
    res.render('index', { title: 'Express' });
});

router.post('/schools', function(req, res, next) {
    var school_name = req.body['university']
    // console.log("School: "  + school_name);
    // console.log("incrementing count");
    School.findBySchool(school_name, function(err, school) {
        if (school) {
          // console.log("Found : " + school.instnm);
          school.count = school.count + 1;
          school.save(function(err) {
              if (err) return err;
          });
        }

        res.redirect("/");
    });
});


module.exports = router;
