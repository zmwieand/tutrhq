var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();
var User = require('../models/user')

router.get('/', function(req, res, next) {
    res.send('here');
});

router.get('/request_tutor', ensureLoggedIn, function(req, res, next) {
    retVal = [];
    User.findActive('', function (err, users) {
        if (users) {
            for (var i in users) {
                user = {};
                user['sender'] = req.user._json.email;
                user['first_name'] = users[i]['first_name'];
                user['last_name'] = users[i]['last_name'];
                user['price'] = users[i]['hourly_rate'];
                user['rating'] = users[i]['rating'];
                user['pic'] = users[i]['pic'];
                user['email_address'] = users[i]['email_address'];
                user['sender_pic'] = req.user._json.picture;
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
