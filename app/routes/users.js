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

            socket.on('test', function(email, status, data, link) {
                socket.emit('notification', email, status, data, link);
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

            socket.on('send accept', function(email) {
              console.log('email:' + email);
              
              User.findByEmail(email, function(err, user) {
                if (user) {
                  user.session.state = "match";
                  user.session.email = req.user._json.email;
                }
                user.save(function(err) {
                  if (err) return err;
                });
              });
              
              User.findByEmail(req.user._json.email, function(err, user) {
                if (user) {
                  user.session.state = "match";
                  user.session.email = email;
                }
                user.save(function(err) {
                  if (err) return err;
                });
              });

              socket.emit('student accept', email);
              socket.emit('tutor accept');
            });
            
            socket.on('send decline', function(email) {
              console.log('email:' + email);
              socket.emit('decline', email);
            });

            socket.on('send start session', function() {
                console.log('STARTING');
                var hours = new Date().getHours();
                var minutes = new Date().getMinutes();
                var session_start = hours + (minutes/60);
                
                // update the tutors db session
                User.findByEmail(req.user._json.email, function (err, tutor) {
                  if (tutor) {
                    tutor.session.state = "start"
                    tutor.session.session_start = session_start;
                    
                    // update the students session as well
                    User.findByEmail(tutor.session.email, function(err, student){
                      if (student) {
                        student.session.state = "start";
                        student.session.session_start = session_start;
                      }
                      student.save(function(err) {
                        if (err) return err;
                      });
                    });
                  }
                  tutor.save(function(err) {
                    if (err) return err;
                  });
                  
                  
                });

                socket.emit('start session');
            });

            socket.on('send end session', function() {
                console.log('ENDING');
                price = 17.38
                var hours = new Date().getHours();
                var minutes = new Date().getMinutes();
                session_end = hours + (minutes/60);
                
                User.findByEmail(req.user._json.email, function (err, tutor) {
                  if (tutor) {
                    tutor.session.state = "end"
                    tutor.session.session_end = session_end;
                    
                    User.findByEmail(tutor.session.email, function(err, student){
                      if (student) {
                        student.session.state = "end";
                        student.session.session_end = session_end;
                      }
                      student.save(function(err) {
                        if (err) return err;
                      });
                    });
                  }
                  tutor.save(function(err) {
                    if (err) return err;
                  });
                });
                
                socket.emit('end session', price);
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
                transactions: [],
                session: {
                    email: "",
                    state: "none",
                    session_start: 0,
                    session_end: 0
                }
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
    var email = req.user._json.email;
    console.log("current user: " + email);
    User.findByEmail(email, function(err, user) {
        if (user) {
            var other = user.session.email;
            console.log("other: " + other);

            // close the current users session
            user.session.email = "";
            user.session.state = "none";
            user.session.session_start = 0;
            user.session.session_end = 0;
            user.save(function(err) {
              if (err) return err;
            });

            // TODO: rate the other person
            res.send('done');
        }
    });
});

module.exports = router;
