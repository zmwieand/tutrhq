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

// var user = {
// 	"email_address" : "something@somewhere.com",
// 	"first_name" : "Steve",
// 	"last_name" : "Something",
// 	"phone_number" : "123-123-4567",
// 	"courses" : ["CSE 115", "MTH 141"],
// 	"role" : "student"
// };

var UPDATEABLE_FIELDS = ["email_address", "first_name",
						 "last_name", "phone_number"];

var REGISTRATION_FIELDS = ["email_address", "password",
						   "confirm_password", "first_name",
						   "last_name", "phone_number"];

/* GET users listing. */
router.get('/', ensureLoggedIn, function(req, res, next) {
 
  User.findByEmail(req.user._json.email, function(err, user) {
  	var out = req.user._json;
	if (user) {
		res.render('map', {"user": user, "tutors": tutors});
	} else {
		var newUser = new User({
	      	first_name: out.given_name,
	      	last_name: out.family_name,
		    email_address: out.email,
		    contact: "fuck off, teach yourself.",
		    courses: [],
		    pic: out.picture,
		    role: "student",
		    rating: 0.0,
		    major: "computer science",
		    hourly_rate: 30.00,
		    transactions: []
	 	});
	 	newUser.save(function(err) {
			if (err) throw err;
			res.render('map', {"user": newUser, "tutors": tutors});
		});
	}
  
  });
  //res.render('map', {"user": user, "tutors": tutors});
});

router.get('/register', function(req, res, next) {
	res.render('register');
});

router.post('/register', function(req, res, next) {
	// check email doesnt exist with another user
	// check passwords match
	for (n in REGISTRATION_FIELDS) {
		var field = REGISTRATION_FIELDS[n];
	}
	// insert into db
	res.send(req.body);
});

router.post('/update', ensureLoggedIn, function(req, res, next) {
    console.log(req.body);
	// check email does not exist if changed
	for (var n in UPDATEABLE_FIELDS) {
		var field = UPDATEABLE_FIELDS[n];
		user[field] = req.body[field];
	}
	// update into db
	res.redirect("/users");
});

router.post('/remove', ensureLoggedIn, function(req, res, next) {
	// remove user from db
	res.redirect('/');
});

router.post('/add_courses', ensureLoggedIn, function(req, res, next) {
    console.log(req.body)
    user['courses'] = req.body['course'];
	res.redirect("/users");
});

// /* GET user profile. */
// router.get('/', ensureLoggedIn, function(req, res, next) {
//   res.render('user', { user: req.user });
// });

module.exports = router;
