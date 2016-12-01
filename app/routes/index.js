var express = require('express');
var passport = require('passport');
var parser = require('body-parser');
var router = express.Router();
var github = require('octonode');
var client = github.client('49538b5fc87b92772b10c1cff9e8c09e9a6ab99d');
var ghrepo = client.repo('zmwieand/tutrhq');
var School = require('../models/school');

var env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'tutrhq'});
});

/* GET form to report a problem */
router.get('/report', function (req, res, next) {
    res.render("problem");
});

/* POST form to report a problem */
router.post('/report', function (req, res, next) {
    var title = req.body.subject;
    var description = req.body.description;

    ghrepo.issue({
        "title": title,
        "body": description,
        "assignees": ["zmwieand",
                      "daviddob",
                      "Tmweppner",
                      "wesleycs",
                      "brijeshrakholia"],
        "labels" : ["user-report"]
    }, function() {});

    res.redirect('/');
});

router.get('/callback',
  passport.authenticate('auth0', {
    failureRedirect: '/authfailure',
  }),
  function(req, res) {
    res.redirect(req.session.returnTo || '/users');
});
//
// search bar function


// router.get('/submit' , function(req, res) {
//   res.render('active_school');
// });

router.get('/submit' , function(req, res) {
  console.log("nonactive test");
  res.render('non_active_school');
});





router.post('/submit', function(req, res, next) {
//    console.log("a suh");
    var school_name = req.body['university']
    School.findBySchool(school_name, function(err, school) {
        if (school) {
          school.count = school.count + 1;
          var are_we_there = school.activeSchool;
          school.save(function(err) {
              if (err) return err;
          });
          if(are_we_there == 0){
            //go to non active school page
            console.log("test1");
            res.redirect('/non_active_school');
          }
          else{
            //go to active school page
            res.redirect('active_school');
          }

        }

        res.redirect("/");
    });

});module.exports = router;
