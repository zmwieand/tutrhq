var express = require('express');
var passport = require('passport')
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('here');
});

router.get('/request_tutor', function(req, res, next) {
    var course = req.body['course'];
    // find the active tutors available for this course
    
    // return the tutors as JSON {image, name, rating, hourly}
    res.send('requesting');
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
