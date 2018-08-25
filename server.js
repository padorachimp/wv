'use strict';
// server.js
// where your node app starts
const PAGE_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('src'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {response.sendFile(__dirname + '/New.html');});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {console.log('Your app is listening on port ' + listener.address().port);});


app.get('/webview', (req, res) => {
  
  let referer = req.get('Referer');
  if (referer) {
          if (referer.indexOf('www.messenger.com') >= 0) {
              res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.messenger.com/');
          } else if (referer.indexOf('www.facebook.com') >= 0) {
              res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.facebook.com/');
          }
          res.sendFile('New.html', {root: __dirname});
      }});



// Sends response messages via the Send API

app.get('/actions', (req, res) => {

  let body = req.query;
  let response =  `?id=${body.psid}&name=${body.Name}&tel=${body.Tel}&address1=${body.Address}&address2=${body.Town}&city=${body.City}&zip=${body.Zip}&select=${body.select}`;
  res.status(200).send('Please close this window to return to the conversation thread.');
  callflowxo(body.psid, response);
});


function callflowxo(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    };
    console.log(request_body);
    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://flowxo.com/hooks/a/dvmk78kp"+response,
        
        "method": "GET",
       
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}












