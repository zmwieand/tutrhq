var express = require('express');
var passport = require('passport')
var router = express.Router();
var User = require('../models/user')

router.get('/', function(req, res, next) {
    res.send('here');
});

var tutors = {"tutors": [
        {"first_name": "Jian",
         "last_name": "Yang",
         "price": 15,
         "rating": 4.9,
         "pic": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg"
        },

        {"first_name": "Something",
         "last_name": "Else",
         "price": 20,
         "rating": 1.2,
         "pic": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg"
        }
    ]};

router.get('/request_tutor', function(req, res, next) {
    // var course = req.body['course'];
    retVal = [];
    User.findActive('', function (err, users) {
        if (users) {
            for (var i in users) {
                user = {};
                user['first_name'] = users[i]['first_name'];
                user['last_name'] = users[i]['last_name'];
                user['price'] = users[i]['hourly_rate'];
                user['rating'] = users[i]['rating'];
                user['pic'] = users[i]['pic'];
                retVal.push(user);
            }
            res.send(retVal);
        }
    });
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
