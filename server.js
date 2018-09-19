'use strict';
// server.js
// where your node app starts

const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const nocache = require('nocache');
const url= require('url');
const immutable = require('immutable');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('src'));
app.use(express.static(path.join(__dirname, 'public')));

var engines = require('consolidate');
app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');

app.get('/', function(request, response) {
});

//showwebview

app.get('/showwebview', (req, res) => {
	let body = req.query;
   const fullUrl = 'https://' + req.get('host')
    let response = {messages:[{
    attachment: {
        type: "template",
        payload: {
            template_type: "button",
            text: "Welcome to our chatbot",
            buttons: [{
                type: "web_url",
                url:  fullUrl+`/webview?id=${body.id}&block=${body.block}`,
                title: "Show Webview",
                messenger_extensions: true
            }]
        }
    }
}]};

	console.log('webview to chatfuel', body);
	console.log(body);
	res.json(response)
		.status(200) 

});


// trigger the webview
app.get('/webview', (req, res) => {
	console.log('Webview opned by', req.query);
  return res.render(__dirname + '/Views/welcome.html',req.query);
});

// Sends response messages via the Send API
app.post('/actions', (req, res) =>
{
	let body = req.body;
	console.log('submitted to server', body);
  ToChatfuel(body)
	res
		.status(200)
		.send(JSON.stringify({success: 'Please close this window to return to the conversation thread.'}));
});




//Chatfuel broadcast
function ToChatfuel(data) 
{
  const Token =process.env.Token;
  const BotID= process.env.BotId;
  const {UserID,Block}=data;
  const BroadCastApiUrl=`https://api.chatfuel.com/bots/${BotID}/users/${UserID}/send`;
  const query = Object.assign({
        chatfuel_token:Token,
        chatfuel_block_name:Block},data);
  const ChatfuelApiUrl = url.format({pathname:BroadCastApiUrl,query});
  const options={
			uri:  ChatfuelApiUrl,
      method: 'post',
			headers:{'Content-Type':'application/json'}};
  console.log(options);
  
	// Send the HTTP request to Chatfuel
	request(options,(err, res, body) => {console.log('body', body);
                                        if (!err) {
                                          console.log('message sent!');
                                        } else {
                                          console.error('Unable to send message to chatfuel:' + err);
                                        }
                                      }
                                    );

}

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
	console.log('Your app is listening on port ' + listener.address().port);
});

const getZipCodes = (data) => {
  let zipcodes = immutable.Map();
  for(let i = 0; i<data.length; i++){
    const record = data[i];
    if(zipcodes.has(record['province'])){
      let province = zipcodes.get(record['province']);
      if(province.has(record['district'])){
        let district = province.get(record['district']);
        const newDist = district.add({subdistrict: record.subdistrict, zipcode: record.zipcode});
        const newProvince = province.update(record['district'], newDist => newDist);
        zipcodes = zipcodes.update(record['province'], newProvince => newProvince);
      } else {
        
      }
    }
    zipcodes.add(data[i]['province']);
  }
};

//const Googledata = require('./ThailandAddress/GetData.js');
//Googledata.search().then((data=>{console.log(data);}));
/*const fs = require('fs');
var data = fs.readFileSync('./ThailandAddress/minidata.json','utf8');
const zipcodes = getZipCodes(data);
console.log(data);*/

