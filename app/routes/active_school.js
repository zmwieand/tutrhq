/* Get the path for active_school */

var express = require('express');
var router = express.Router();

router.get('/' , function(req, res) {
  res.render('active_school');
});

module.exports = router;
