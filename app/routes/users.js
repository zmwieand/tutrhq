var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();
var User = require('../models/user');

var tutors = [
	{"first_name": "Jian",
	 "last_name": "Yang",
	 "price": 15,
	 "rating": 4.9},

	 {"first_name": "Russ",
	 "last_name": "Hanneman",
	 "price": 20,
	 "rating": 3.6},

	 {"first_name": "Erlich",
	 "last_name": "Bachman",
	 "price": 12,
	 "rating": 0.6},

	 {"first_name": "Jon",
	 "last_name": "Snow",
	 "price": 14,
	 "rating": 0.0},
];

router.get('/', ensureLoggedIn, function(req, res, next) {
  User.findByEmail(req.user._json.email, function(err, user) {
  	var out = req.user._json;
		if (user) {
			res.render('map', {"user": user, "tutors": tutors});
		} else {
			var newUser = new User({
	      	first_name: out.given_name,
	      	last_name: out.family_name,
	      	nickname: "",
			    email_address: out.email,
			    contact: "",
			    courses: [],
			    pic: out.picture,
			    role: "student",
			    rating: 0.0,
			    major: "",
			    hourly_rate: 0.0,
			    transactions: []
		 	});
		 	newUser.save(function(err) {
				if (err) throw err;
			});
			res.render('map', {"user": newUser, "tutors": tutors});
		}
  });
});

router.post('/update', ensureLoggedIn, function(req, res, next) {
    User.findByEmail(req.user._json.email, function (err, user) {
    	if (user) {
    		if (req.body['nickname']) user.nickname = req.body['nickname'];
    		if (req.body['major']) user.major = req.body['major'];
    		if (req.body['pic']) user.pic = req.body['pic'];
    		if (req.body['contact']) user.contact = req.body['contact'];
    	}
    	user.save(function(err) {
    		if (err) return err;
    	});
    	res.redirect("/users");
    });
});

router.post('/remove', ensureLoggedIn, function(req, res, next) {
	User.findByEmail(req.user._json.email, function(err, user) {
		if (user) {
			user.remove(function(err){
				if (err) return err;
				console.log(req.user._json.email + " is removed from the tutr database.");
			});
		}
		res.redirect('/');
	});
});

router.post('/add_courses', ensureLoggedIn, function(req, res, next) {
    User.findByEmail(req.user._json.email, function (err, user) {
    	if (user) {
    		console.log(req.body['course']);
    		if (req.body['course']) {
    			user.courses = req.body['course'];
    		} else {
    			user.courses = [];
    		}
    	}
    	user.save(function(err) {
			if (err) throw err;
		});
    	res.redirect('/users');
    });

});

router.post('/rating', ensureLoggedIn, function(req, res, next) {
	res.redirect('/users');
});

router.get('/register', function(req, res, next) {
	res.render('register');
});

// This should probably be removed
router.post('/register', function(req, res, next) {
	res.send(req.body);
});

router.get('/tutor_online', ensureLoggedIn, function(req, res, next) {
    User.findByEmail(req.user._json.email, function (err, user) {
        if (user && user.role == "tutor") {
               res.redirect('/users');
        } else {
            res.render('error', {
                message: "You shouldn't be here. Please fuck off."
            });
        }
    });
});

router.get('/tutor_offline', ensureLoggedIn, function(req, res, next) {
    User.findByEmail(req.user._json.email, function (err, user) {
        if (user && user.role == "tutor") {
               res.redirect('/users');
        } else {
            res.render('error', {
                message: "You shouldn't be here. Please fuck off."
            });
        }
    });
});

router.post('/rate', function(req, res, next) {
    var rating = req.body['rating'];
    console.log('Rating: ' + rating);
    res.redirect('/users');
});

module.exports = router;
