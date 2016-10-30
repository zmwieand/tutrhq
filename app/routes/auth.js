var express = require('express');
var passport = require('passport');
var router = express.Router();
var User = require('../models/user');

var env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || 'http://'+localhost+':3000/callback'
};

router.get('/login', function(req, res){
    res.render('login', { env: env });
});

router.get('/logout', function(req, res){
  User.findByEmail(req.user._json.email, function(err, user) {
    if (user) {
      user['is_active'] = false;
      user.save(function(err) {
        if (err) throw err;
      });
    }
  });
  req.logout();
  res.redirect('/');
});

module.exports = router;
