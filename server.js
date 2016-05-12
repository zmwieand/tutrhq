var express = require('express');
var bodyParser = require('body-parser');
var formidable = require("formidable");
var app = express();

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
		// make sure the email is valid and doesn't already exist
		// if it does flash an error message
		console.log(email);
	});
	res.sendFile(__dirname + '/html/success.html');
});


app.listen(8080);
