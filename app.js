const fs = require('fs');
const express = require('express');
const hostname = '127.0.0.1';
const port = 80;
var app = express();
const bodyParser = require('body-parser');
var parseJSON = bodyParser.json();
var parseURL = bodyParser.urlencoded({ extended: false });
let currentUsers = {};
let userRecords = {};
const midnight = "00:00:00";
const re = new RegExp('..:..:..');

// Reset file at midnight of each day
// setInterval(function(){
//   now = new Date();
//   now = now.toString().match(re)[0];
//   console.log(now);
//   if (midnight === now) {
//     fs.writeFile('baseFile.json', JSON.stringify(baseFile));
//   }
// }, 1000);

//Load static resources (HTML, CSS, JS)
app.use('/admin', express.static('admin'));
app.use('/', express.static('public'));
//Handle GET requests for userRecords
app.post('/admin', parseURL, function(req, res){
    //Send admin page if authentication is successful
    req.body && res.sendFile('/Users/tylercampbell/Desktop/node/admin/admin.html');
});


app.get('/userRecords', function(req, res){
  fs.readFile('userRecordsV2.json', 'utf8', function(err, data){
    data ? userRecords = JSON.parse(data) : userRecords = "";
    res.send(JSON.stringify(userRecords));
    });
});

app.get('/dailyGoal', function(req, res){
  fs.readFile('dailyGoal.json', 'utf8', function(err, data){
    dailyGoal = JSON.parse(data);
    res.send(JSON.stringify(dailyGoal));
    });
});


//Handle post requests from Zendesk
app.post('/post', parseURL, function(req, res){
  fs.writeFile('dailyGoal.json', JSON.stringify(req.body));
  res.redirect('/admin');
});


app.post('/delete', parseURL, function(req, res){
  var userName = JSON.parse(JSON.stringify(req.body));
  var userFound;
  userName = userName.username;
  console.log(userName);
  function findUser(object, name){
    for (key in object) {
      object[key].name === name ? delete object[key] : console.log("Incorrect user");
    }
    currentUsers = object;
    fs.writeFile('currentUsersV2.json', JSON.stringify(currentUsers));
    fs.readFile('userRecordsV2.json', 'utf8', function(err, data){
      var userRecordsObject = JSON.parse(data);
      delete userRecordsObject.solved[userName];
      delete userRecordsObject.assigned[userName];
      fs.writeFile('userRecordsV2.json', JSON.stringify(userRecordsObject));
      res.redirect('/admin');
    });
  }

  fs.readFile('currentUsersV2.json', 'utf8', function(err, data){
    
    data ? currentUsers = JSON.parse(data) : currentUsers = {};
    currentUserNames = [];
    Object.values(currentUsers).forEach(function(object){
      currentUserNames.push(object.name);
    });
    currentUserNames.includes(userName) ? findUser(currentUsers, userName) : res.redirect('/admin?response=error404');
    });
});

app.post('/add', parseURL, function(req, res){
    var userInfo = JSON.parse(JSON.stringify(req.body));
    var userName = userInfo.username;
    var imgSrc = userInfo.img;
    console.log(req.body);

    fs.readFile('currentUsersV2.json', 'utf8', function(err, data){
      err && res.redirect('/admin/error=500');
      data ? currentUsers = JSON.parse(data) : currentUsers = {};
      var newUserId;
      var userIdArray = Object.keys(currentUsers);
      userIdArray.length != 0 ? newUserId = Number(userIdArray.pop()) + 1 : newUserId = 1;
      currentUsers[newUserId] = {"name": `${userName}`, "imgSrc": `${imgSrc}`};
      fs.writeFile('currentUsersV2.json', JSON.stringify(currentUsers));
      fs.readFile('userRecordsV2.json', 'utf8', function(err, data){
        err && res.redirect('/admin/error=500');
        data ? userRecordObject = JSON.parse(data) : userRecordObject = {"solved": {}, "assigned": {}};
        userRecordObject.solved[userName] = 0;
        userRecordObject.assigned[userName] = 0;
        fs.writeFile('userRecordsV2.json', JSON.stringify(userRecordObject));
        // res.redirect('/admin');
        res.send("test");
        });
      });
});



app.post('/api', parseJSON, function(req, res){
  var userObject = req.body;
  fs.readFile('currentUsersV2.json', 'utf8', function(err, data){
      currentUsers = Object.values(Object.values(JSON.parse(data)));
      currentUserNames = [];
      currentUsers.forEach(function(user){
        currentUserNames.push(user.name);
      });
      
  
      fs.readFile('userRecordsV2.json', 'utf8', function(err, data){
        //Ensure that user in POST request is listed in the currentUsers object
        var userAction = Object.keys(userObject)[0];
        var userName = Object.values(userObject)[0];
        userRecords = JSON.parse(data);
        currentUserNames.includes(userName) ? userRecords[userAction][userName] += 1 : console.log("User not found");
        fs.writeFile('userRecordsV2.json', JSON.stringify(userRecords));
        res.status(201).send("Success");
     });
  }); 
  
})

//Listen to port 
app.listen(80);
console.log(`Server running at http://${hostname}:${port}/`);






  

 
 
 
 
