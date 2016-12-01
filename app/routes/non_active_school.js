/* Get the path for non_active_school */

var express = require('express');
var router = express.Router();

router.get('/' , function(req, res) {
  res.render('non_active_school');
});

module.exports = router;
