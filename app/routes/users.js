var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();
var User = require('../models/user');

router.get('/', ensureLoggedIn, function(req, res, next) {
    User.findByEmail(req.user._json.email, function(err, user) {
        if (!sockets_on) {
            res.io.on('connection', function(socket){
                sockets_on = true;
                socket.on('set_socket', function (email) {
                    if (!connections[email]) {
                        connections[email] = socket;
                    } else {
                        delete connections[email];
                        connections[email] = socket;
                    }
                });

                socket.on('disconnect', function(){
                    delete connections[req.user._json.email];
                    console.log('someone got disconnected.');
                });

                socket.on('test', function(email, status, data, link) {
                    socket.emit('notification', email, status, data, link);
                });

                socket.on('send notification', function(email, sender, link) {
                  console.log(connections);
                  if (connections[email] && connections[email].connected) {
                    socket.broadcast.to(connections[email].id).emit('notification', sender, true, " needs help. Please help him?", link);
                  } else {
                    socket.emit('notification', email, false, " is not available.");
                  }
                });

                socket.on('send accept', function(email) {
                  console.log('email:' + email);

                  var other;

                  User.findByEmail(email, function(err, student) {
                    if (err) return err;
                    if (student) {
                      other = student;
                      student.session.state = "match";
                      student.session.email = req.user._json.email;
                    }
                    student.save(function(err) {
                      if (err) return err;
                    });
                  });

                  User.findByEmail(req.user._json.email, function(err, tutor) {
                    if (err) return err;
                    if (tutor) {
                      tutor.session.state = "match";
                      tutor.session.email = email;
                    }
                    tutor.save(function(err) {
                      if (err) return err;
                    });
                    if (connections[email] && connections[email].connected) {
                        socket.broadcast.to(connections[email].id).emit('student accept', tutor.first_name + ' ' + tutor.last_name);
                        socket.emit('tutor accept', {lat: tutor.latitude, lng: tutor.longitude}, 
                            {lat: other.latitude, lng: other.longitude});
                    } else {
                        console.log(req.user);
                        socket.emit('tutr_error', req.user.displayName + " is offline. sorry bruh. btw, a suh dude?");
                    }
                  });



                });

                socket.on('send decline', function(email) {
                  if (connections[email] && connections[email].connected) {
                      socket.broadcast.to(connections[email].id).emit('decline');
                  } else {
                      socket.emit('tutr_error', "error");
                  }
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
                            if (connections[student.email_address] && connections[student.email_address].connected) {
                                socket.broadcast.to(connections[student.email_address].id).emit('start session');
                                socket.emit('start session')
                            } else {
                                socket.emit('tutr_error', "error");
                            }
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
                            if (connections[student.email_address] && connections[student.email_address].connected) {
                                session_time = session_end - tutor.session.session_start;
                                console.log("Time: " + session_time);

                                if (session_time < 0) {
                                    session_time += 24;
                                }

                                if (session_time < .5) {
                                    session_time = .5;
                                }

                                price = session_time * tutor.hourly_rate;
                                console.log('Price: ' + price);
                                socket.broadcast.to(connections[student.email_address].id).emit('end session', price);
                                socket.emit('end session', price);
                            } else {
                                socket.emit('tutr_error', "error");
                            }
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
                });
            });
        }
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
                message: "503: Something went wrong."
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

router.get('/get_location', ensureLoggedIn, function(req, res, next) {
    console.log('location');
    User.findByEmail(req.user._json.email, function(err, user){
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({lat: user.latitude, lng: user.longitude}));
    });
    
});

//
// module.exports =  {
//     start: function(io) {
//         io.on('connection', function(socket) {
//
//         });
//     },
//     router: router
// }
 module.exports = router;
