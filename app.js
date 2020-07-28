var express = require('express');
var app = express();
app.use(express.json());

var requests = [];
const VERIFY_TOKEN = 'nodeapp';
const PORT = process.env.PORT || 5000

app.get('/', function(req,res) {
    res.send("<h1>Mac's Heroku App</h1>");
});

app.get('/getreq', function (req, res) {
    let request = requests.shift();
    if(request)
      res.json(request)
    else
      res.status(404).send();
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

app.listen(PORT, function () {
  console.log('Echo app listening on port 3000!');
});