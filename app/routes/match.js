var express = require('express');
var passport = require('passport')
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('here');
});

var tutors = {"tutors": [
        {"first_name": "Jian",
         "last_name": "Yang",
         "price": 15,
         "rating": 4.9,
         "pic": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg"
        }
    ]};

router.get('/request_tutor', function(req, res, next) {
    // var course = req.body['course'];
    res.send(tutors["tutors"]);
});

router.post('/select_tutor', function(req, res, next) {
    res.send('select');
});

router.get('/start', function(req, res, next) {
    res.send('start');
});

router.get('/stop', function(req, res, next) {
    res.send('stop');
});

router.get('/accept', function(req, res, next){
    res.send('accept');
});

router.post('/cancel', function(req, res, next) {
    var reason = req.body['reason'];
    console.log("Reason: " + reason);
    res.redirect('/users');
});

module.exports = router;
