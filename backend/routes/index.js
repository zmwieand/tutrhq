var express = require('express');
var path = require('path');
var parser = require('body-parser');
var router = express.Router();

var github = require('octonode');
var client = github.client('49538b5fc87b92772b10c1cff9e8c09e9a6ab99d');
var ghrepo = client.repo('zmwieand/tutrhq');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET form to report a problem */
router.get('/report', function (req, res, next) {
    res.render("problem");
});

/* POST form to report a problem */
router.post('/report', function (req, res, next) {
    var title = req.body.subject;
    var description = req.body.description;

    ghrepo.issue({
        "title": title,
        "body": description,
        "assignees": ["zmwieand",
                      "daviddob",
                      "Tmweppner",
                      "wesleycs",
                      "brijeshrakholia"],
        "labels" : ["user-report"]
    }, function() {});

    res.redirect('/');
});

module.exports = router;
