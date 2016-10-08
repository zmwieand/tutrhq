var express = require('express');
var passport = require('passport');
var router = express.Router();


var env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
};

router.get('/login', function(req, res){
    res.render('login', { env: env });
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});



module.exports = router;