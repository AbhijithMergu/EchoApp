var express = require('express');
var escape = require('escape-html');

var app = express();
app.use(express.json());

var requests = {};
const VERIFY_TOKEN = 'nodeapp';
const PORT = process.env.PORT || 5000

app.get('/', function(req,res) {
    res.send("<h1>Mac's Heroku App</h1>");
});

app.post('/sharepoint_webhook', function(req, res){
  if (req.query && req.query.validationToken) {
    res.send(escape(req.query.validationToken));
    // Send a status of 'Ok'
    status = 200;
  }
  res.status(status).end(http.STATUS_CODES[status]);
});

app.get('/:user/getreq', function (req, res) {
    let user = req.params.user;
    let request = null;
    if(requests.hasOwnProperty(user))
      request = requests[user].shift();
    if(request)
      res.json(request)
    else
      res.status(404).send();
});

app.post('/:user/webhook', function (req, res) {
    let user = req.params.user;
    let request = {};
    request.headers = req.headers;
    request.body = req.body;
    request.params = req.query;
    if(requests.hasOwnProperty(user)){
      requests[user].push(request);
      res.status(200).send();
    } else {
      res.status(401).send();
    }
});

app.get("/:user/webhook", (req, res) => {
    let user = req.params.user;
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    let reqSuccess = true;
    if (mode && token) {
      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        // Responds with the challenge token from the request
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
        requests[user] = [];
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        reqSuccess = false;
      }
    } else{
      reqSuccess = false;
    }

    if(!reqSuccess)
      res.sendStatus(403);
});

app.listen(PORT, function () {
  console.log(`Echo app listening on port ${PORT}!`);
});