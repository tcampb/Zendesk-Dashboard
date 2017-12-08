const fs = require('fs');
const express = require('express');
const hostname = '127.0.0.1';
const port = 80;
const bodyParser = require('body-parser');
var parseJSON = bodyParser.json();
var app = express();
let currentUsers = {};
let userRecords = {};
const midnight = "19:09:00";
const re = new RegExp('..:..:..');
let now = null;


//Reset file at midnight of each day
// setInterval(function(){
//   now = new Date();
//   now = now.toString().match(re)[0];
//   console.log(now);
//   if (midnight === now) {
    
//   }
// }, 1000);



//Load static resources (HTML, CSS, JS)
app.use('/', express.static('public'));

//Handle GET requests for userRecords
app.get('/userRecords', function(req, res){
    res.send(JSON.stringify(userRecords));
});

//Handle post requests from Zendesk
app.post('/api', parseJSON, function(req, res){
  var userObject = req.body;

  fs.readFile('currentUsers.json', 'utf8', function(err, data){
      currentUsers = JSON.parse(data);
      fs.readFile('userRecords.json', 'utf8', function(err, data){
        //Ensure that user in POST request is listed in the currentUsers object
        var userReq = userObject.name;
        userRecords = JSON.parse(data);
        Object.values(currentUsers).includes(userObject.name) ? userRecords[userReq] += 1 : console.log("User not found");
        fs.writeFile('userRecords.json', JSON.stringify(userRecords));
        res.status(201).send("Success");
     });
  }); 
  
})






//Run controllers
// dataController(app)

//Listen to port 
app.listen(80);
console.log(`Server running at http://${hostname}:${port}/`);






  

 
 
 
 
