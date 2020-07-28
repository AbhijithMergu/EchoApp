var express = require('express');
var app = express();
app.use(express.json());

var requests = [];
var VERIFY_TOKEN = 'nodeapp';

app.get('/', function(req,res) {
    res.send("<h1>Mac's Heroku App</h1>");
});

app.get('/getreq', function (req, res) {
    res.json(requests.shift())
});

app.post('/webhook', function (req, res) {
    let request = {};
    request.headers = req.headers;
    request.body = req.body;
    requests.push(request);
    res.status(200).send();
});

app.get("/webhook", (req, res) => {
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
  
    if (mode && token) {
      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        // Responds with the challenge token from the request
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
      }
    }
  });

app.listen(3000, function () {
  console.log('Echo app listening on port 3000!');
});