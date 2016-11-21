var express = require('express');
//var passport = require('passport');
var router = express.Router();

router.get('/' , function(req, res) {
  res.render('signup');
});

module.exports = router;
