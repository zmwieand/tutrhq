var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();
var User = require('../models/user');

router.get('/', ensureLoggedIn, function(req, res, next) {

    User.findByEmail(req.user._json.email, function(err, user) {
        res.io.on('connection', function(socket){
            socket.on('set_socket', function (email) {
                connections[email] = socket;
            });
            socket.on('disconnect', function(){
              console.log('someone got disconnected.');
            });
            socket.on('send notification', function(email, sender, link) {
              console.log(email);
              console.log(sender);
              if (connections[email] && connections[email].connected) {
                socket.broadcast.to(connections[email].id).emit('notification', sender, true, " needs help. Please help him?", link);
              } else {
                socket.emit('notification', email, false, " is not available.");
              }
            });

            socket.on('send accept', function(email, sender){
              console.log('email:' + email);
              console.log('sender:' + sender);
              socket.emit('student accept', email);
              socket.emit('tutor accept');
            });
            
            socket.on('send decline', function(email, sender){
              console.log('email:' + email);
              console.log('sender:' + sender);
              socket.emit('decline', email);
            });

            socket.on('send start session', function() {
                console.log('STARTING');
                socket.emit('start session');
                // This should just mark a timestamp in the db and flash a
                // message to the student
            });

            socket.on('send end session', function() {
                console.log('ENDING');
                price = 17.38
                socket.emit('end session', price);
                // This should end the session and send a rating and both
                // student and tutor with the price
            });
        });
        var out = req.user._json;
        if (user) {
            res.render('map', {
                "user": user
            });
        } else {
            var newUser = new User({
                first_name: out.given_name,
                last_name: out.family_name,
                nickname: "",
                email_address: out.email,
                longitude: 78.78891,
                latitude: 42.999999,
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
            res.render('map', {
                "user": newUser
            });

        }
    });
});

router.post('/update', ensureLoggedIn, function(req, res, next) {
    User.findByEmail(req.user._json.email, function(err, user) {
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
            user.remove(function(err) {
                if (err) return err;
                console.log(req.user._json.email + " is removed from the tutr database.");
            });
        }
        res.redirect('/');
    });
});

router.post('/add_courses', ensureLoggedIn, function(req, res, next) {
    User.findByEmail(req.user._json.email, function(err, user) {
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
    User.findByEmail(req.user._json.email, function(err, user) {
        if (user && user.role == "tutor") {
            user.is_active = true;
            user.save(function(err) {
                if (err) throw err;
            });
            res.redirect('/users');
        } else {
            res.render('error', {
                message: "You shouldn't be here. Please fuck off."
            });
        }
    });
});

router.get('/tutor_offline', ensureLoggedIn, function(req, res, next) {
    User.findByEmail(req.user._json.email, function(err, user) {
        if (user && user.role == "tutor") {
            console.log('tutor offline');
            user.is_active = false;
            user.save(function(err) {
                if (err) throw err;
            });
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
