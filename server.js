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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('src'));
app.use(nocache());

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
	response.sendFile(__dirname + '/New.html');
});

app.get('/webview', (req, res) => {
	console.log('a new re"quest made');
  
  return res.sendFile(path.join(__dirname + '/New.html'));
  
	let referer = req.get('Referer');
	console.log('ref', referer);
	function refFound(ref) {
		console.log('ref found', ref);
	}
	if (referer) {
		if (referer.indexOf('www.messenger.com') >= 0) {
			refFound('www.messenger.com');
			res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.messenger.com/');
		} else if (referer.indexOf('www.facebook.com') >= 0) {
			refFound('www.facebook.com');
			res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.facebook.com/');
		} else if (referer.indexOf('staticxx.facebook.com') >= 0) {
			refFound('staticxx.facebook.com');
			res.setHeader(
				'X-Frame-Options',
				'ALLOW-FROM https://www.facebook.com/'
			);
		} else if (referer.indexOf('m.facebook.com') >= 0) {
			refFound('m.facebook.com');
			res.setHeader('X-Frame-Options', 'ALLOW-FROM http://m.facebook.com/');
		} else if (referer.indexOf('glib-flyingfish.glitch.me') >= 0) {
			refFound('glib-flyingfish.glitch.me');
			res.setHeader(
				'X-Frame-Options',
				'ALLOW-FROM https://glib-flyingfish.glitch.me/'
			);
		}
		return res.sendFile(path.join(__dirname + '/New.html'));
	}
	res.status(501).send('Something went wrong');
});

// Sends response messages via the Send API
app.post('/actions', (req, res) => {
	let body = req.body;
	console.log('submitted to server');
	let response = `?id=${body.psid}&name=${body.Name}&tel=${body.Tel}&address1=${
		body.Address}&address2=${body.Town}&city=${body.City}&zip=${body.Zip}&select=${body.select}`;
	callflowxo(body.psid, response);
	console.log(body);
	res
		.status(200)
		.send('Please close this window to return to the conversation thread.');
});

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

function callflowxo(sender_psid, response) {
	// Construct the message body
	let request_body = { recipient: { id: sender_psid }, message: response };
	console.log(request_body);
	// Send the HTTP request to flowxo
	request(
		{
			uri: 'https://flowxo.com/hooks/a/6km6a7md' + response,
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
