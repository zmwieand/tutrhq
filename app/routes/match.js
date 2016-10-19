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

module.exports = router;
