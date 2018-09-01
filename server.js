'use strict';
// server.js
// where your node app starts
const PAGE_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const nocache = require('nocache');
const  FlowxoWebhookURL = 'https://flowxo.com/hooks/a/6km6a7md'
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('src'));
app.use(nocache());


app.get('/', function(request, response) {
  console.log("hi");
	response.sendFile(path.join(__dirname + '/welcome.html'));
});


// trigger the webview
app.get('/webview', (req, res) => {
	console.log('a new re"quest made');
  return res.sendFile(path.join(__dirname + '/New.html'));
});

// Sends response messages via the Send API
app.post('/actions', (req, res) => {
	let body = req.body;
	console.log('submitted to server', body);
	let response = `?id=${body.psid}&name=${body.Name}&tel=${body.Tel}&address1=${
		body.Address}&address2=${body.Town}&city=${body.City}&zip=${body.Zip}&select=${body.select}`;
	callflowxo(body.psid, response);
	console.log(body);
	res
		.status(200)
		.send(JSON.stringify({success: 'Please close this window to return to the conversation thread.'}));
});

// receive logs from the webhook 
app.post('/logs', (req, res) => {
	console.log('Logging...');
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	let message = req.body.message;
	let o = req.body.o;
	if (o) {
		message = message + '\t' + o;
	}

	console.log('***Log: ' + message);
	var m = new Date();
	var dateString =
		m.getUTCFullYear() +
		'/' +
		(m.getUTCMonth() + 1) +
		'/' +
		m.getUTCDate() +
		' ' +
		m.getUTCHours() +
		':' +
		m.getUTCMinutes() +
		':' +
		m.getUTCSeconds();
	message = '\n' + dateString + ' -- ' + ip + ' -- ' + message + '\n';
	var fs = require('fs');
	fs.appendFile(path.join(__dirname + '/log.txt'), message, function(err) {
		if (err) {
			return console.log(err);
		}

		console.log('The file was saved!');
	});
});


// flowxo send request 
function callflowxo(sender_psid, response) {

	// Send the HTTP request to flowxo
	request(
		{
			uri: FlowxoWebhookURL + response,
			method: 'GET'
		},
		(err, res, body) => {
			console.log('body', body);
			if (!err) {
				console.log('message sent!');
			} else {
				console.error('Unable to send message:' + err);
			}
		}
	);
}

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
	console.log('Your app is listening on port ' + listener.address().port);
});
