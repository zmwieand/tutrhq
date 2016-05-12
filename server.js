var express = require('express');
var formidable = require("formidable");
var app = express();

app.set('port', (process.env.PORT || 5000));

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
		console.log(email);
	});
	res.sendFile(__dirname + '/html/success.html');
});


app.listen(app.get('port'), function () {
	console.log("http://localhost:" + app.get('port'));
});


/* using SendGrid's Node.js Library */

// var sendgrid = require("sendgrid")("SENDGRID_APIKEY");
// var email = new sendgrid.Email();

// email.addTo("test@sendgrid.com");
// email.setFrom("you@youremail.com");
// email.setSubject("Sending with SendGrid is Fun");
// email.setHtml("and easy to do anywhere, even with Node.js");

// sendgrid.send(email);
