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
let baseFile = {
	"solved": {
		"Lisa Zhang": 0,
		"Hannah Tatum": 0,
		"Zachary Smith": 0,
		"Joelle Waksman": 0,
		"Tim DaGraca": 0,
		"Katie Owens": 0,
		"Jacob Richard-Smith": 0,
		"Tyler Campbell": 0
	},
	"assigned": {
		"Lisa Zhang": 0,
		"Hannah Tatum": 0,
		"Zachary Smith": 0,
		"Joelle Waksman": 0,
		"Tim DaGraca": 0,
		"Katie Owens": 0,
		"Jacob Richard-Smith": 0,
		"Tyler Campbell": 0
	}
}

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
// app.use('/', express.static('public'));
//Handle GET requests for userRecords
app.get('/userRecords', function(req, res){
  fs.readFile('userRecordsV2.json', 'utf8', function(err, data){
    userRecords = JSON.parse(data);
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
// app.post('/api', parseJSON, function(req, res){
//   var userObject = req.body;

//   fs.readFile('currentUsers.json', 'utf8', function(err, data){
//       currentUsers = JSON.parse(data);
//       fs.readFile('userRecords.json', 'utf8', function(err, data){
//         //Ensure that user in POST request is listed in the currentUsers object
//         var userReq = userObject.name;
//         userRecords = JSON.parse(data);
//         Object.values(currentUsers).includes(userObject.name) ? userRecords[userReq] += 1 : console.log("User not found");
//         fs.writeFile('userRecords.json', JSON.stringify(userRecords));
//         res.status(201).send("Success");
//      });
//   }); 
  
// })

//v2
app.post('/post', parseURL, function(req, res){
  fs.writeFile('dailyGoal.json', JSON.stringify(req.body));
  res.redirect('/admin');
});


app.post('/delete', parseURL, function(req, res){
  // fs.writeFile('dailyGoal.json', JSON.stringify(req.body));
  var userName = JSON.parse(JSON.stringify(req.body));
  userName = userName.Username;
  function findUser(object, name){
    for (key in object) {

      object[key].name === name ? delete object[key] : console.log("Incorrect user");
    }
    currentUsers = object;
    fs.writeFile('currentUsersV2.json', JSON.stringify(currentUsers));
  }

  fs.readFile('currentUsersV2.json', 'utf8', function(err, data){
    // currentUsers = JSON.parse(data);
    currentUsers = JSON.parse(data);
    currentUserNames = [];
    Object.values(currentUsers).forEach(function(object){
      currentUserNames.push(object.name);
    });
    // Object.values(currentUsers).includes(userName) ? findUser(currentUsers, userName) : console.log("User not found");
    currentUserNames.includes(userName) ? findUser(currentUsers, userName) : console.log("User not found");
    }); 

  res.redirect('/admin');
});

app.post('/add', parseURL, function(req, res){
    var userInfo = JSON.parse(JSON.stringify(req.body));
    var userName = userInfo.username;
    var imgSrc = userInfo.img;

    fs.readFile('currentUsersV2.json', 'utf8', function(err, data){
      currentUsers = JSON.parse(data);
      var userIdArray = Object.keys(currentUsers);
      var newUserId = Number(userIdArray.pop()) + 1;
      currentUsers[newUserId] = {"name": `${userName}`, "imgSrc": `${imgSrc}`};
      fs.writeFile('currentUsersV2.json', JSON.stringify(currentUsers));
      res.redirect('/admin');
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
        // var userReq = userObject.name;
        userRecords = JSON.parse(data);
        currentUserNames.includes(userName) ? userRecords[userAction][userName] += 1 : console.log("User not found");
        // Object.values(currentUsers).includes(userName) ? userRecords[userAction][userName] += 1 : console.log("User not found");
        fs.writeFile('userRecordsV2.json', JSON.stringify(userRecords));
        res.status(201).send("Success");
     });
  }); 
  
})

//Listen to port 
app.listen(80);
console.log(`Server running at http://${hostname}:${port}/`);






  

 
 
 
 
