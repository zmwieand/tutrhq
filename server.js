var express = require('express');
var formidable = require("formidable");
var MongoClient = require('mongodb').MongoClient;
var app = express();
var _db;

/* Use and environment variable for the port */
app.set('port', (process.env.PORT || 5000));

/* Setup the database */
MongoClient.connect("mongodb://localhost:27017/tutordb", function(err, db) {
	if(!err) {
		_db = db;
  		db.createCollection('email', {strict:true}, function(err, collection) {});
  		db.createCollection('schools', {strict:true}, function(err, collection) {});
  		console.log("We are connected to Tutordb");
	}
});

/* root of Tutor */
app.get('/', function(req, res) {
	console.log('GET: index');
	res.sendFile(__dirname + '/index.html');
});

/* Email subscription */
app.post('/subscribe/', function(req, res) {
	// console.log('received: '+ req.body);
	var form = formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		var email = fields.email;
		// make sure the email is well formed and doesn't already exist
		// if it does flash an error message
		if (!wellFormedEmail(email)) {
			res.end('this was not a well formed email, please try again');
			return;
		}
		
		var coll = _db.collection('email');
		coll.findOne({'email': email}, function(err, result) {
			if (result) {
				res.end('looks like you already subscribed');
			} else {
				// insert in to the db and send an email;
				insertEmail(email);
				sendEmail(email);
			}
		});
		

	});
	res.sendFile(__dirname + '/html/success.html');
});

/* What schools are interested in Tutor */
app.post('/tutor_to/', function(req, res){
	var form = formidable.IncomingForm();
	form.parse(req, function(err, fields, files){
		var school = fields.school;
		console.log(school);
	});
	res.end("Thanks for letting us know :)");
});

app.listen(app.get('port'), function () {
	console.log("server.js is running on http://localhost:" + app.get('port'));
});


function wellFormedEmail(email) {
	var arr = email.split("@");
	if (arr.length != 2) {
		console.log('invalid email');
		return false;
	}

	var domain = arr[1];
	arr = domain.split('.');
	if (arr.length != 2) {
		console.log('invalid domain');
		return false;
	}

	// make sure that this is a .edu email
	var ext = arr[1];
	if (ext != 'edu') {
		console.log('this is not a .edu email');
		return false;
	}

	return true;
};

function sendEmail(email) {
	console.log('We will send an email to: ' + email);
	/* using SendGrid's Node.js Library */

	// var sendgrid = require("sendgrid")("SENDGRID_APIKEY");
	// var email = new sendgrid.Email();

	// email.addTo("test@sendgrid.com");
	// email.setFrom("you@youremail.com");
	// email.setSubject("Sending with SendGrid is Fun");
	// email.setHtml("and easy to do anywhere, even with Node.js");

	// sendgrid.send(email);
};


function insertEmail(email) {
	// console.log('inserting email');
	var doc = {'email' : email};
	var emailCollection = _db.collection('email');
	emailCollection.insert(doc);
}
