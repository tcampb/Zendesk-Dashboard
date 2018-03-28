var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var parseJSON = bodyParser.json();
var parseURL = bodyParser.urlencoded({ extended: false });
var currentUsers = {};
var userRecords = {};
var multer  = require('multer')
var upload = multer({ dest: 'public/uploads/' });
var app = express();

require('dotenv').config()
var token = process.env.TOKEN;


//Load static resources (HTML, CSS, JS)
app.use('/', express.static('public'));
app.use('/admin', express.static('auth'));
//Handle GET requests for userRecords
app.post('/admin', parseURL, function(req, res){
  console.log(req.header('PATH'));
  if (req.header('TOKEN') === token){
    //Send admin page if authentication is successful
    app.use('/user', express.static('admin'));
    req.body && res.send('/user');
  } else if (req.header('PATH') === '/user/') {
    res.send('invalid user');
  } else {
    res.sendStatus(403);
  }
});

app.get('/currentUsers', function(req, res){
  fs.readFile('currentUsers.json', 'utf8', function(err, data){
    data ? currentUsers = JSON.parse(data) : currentUsers = "";
    res.send(JSON.stringify(currentUsers));
    });
});

app.get('/userRecords', function(req, res){
  fs.readFile('userRecords.json', 'utf8', function(err, data){
    data ? userRecords = JSON.parse(data) : userRecords = "";
    res.send(JSON.stringify(userRecords));
    });
});

app.get('/dailyGoal', function(req, res){
  fs.readFile('dailyGoal.json', 'utf8', function(err, data){
    data ? dailyGoal = JSON.parse(data) : dailyGoal = "No data"; 
    res.send(JSON.stringify(dailyGoal));
    });
});

//Handle post request from Admin console (goals)
app.post('/api/setgoal', parseURL, function(req, res){
  if (req.header('TOKEN') != token ) {
    res.sendStatus(403);
  } else {
    fs.writeFile('dailyGoal.json', JSON.stringify(req.body));
    res.redirect('/admin');
  }
});

//Handle delete requests from Admin console
app.post('/api/removeuser', parseURL, function(req, res){
  if (req.header('TOKEN') != token) {
    res.sendStatus(403);
  } else {
      var userName = JSON.parse(JSON.stringify(req.body));
      var userFound;
      userName = userName.username;
      function findUser(object, name){
        for (key in object) {
          object[key].name === name ? delete object[key] : console.log("Incorrect user");
        }
        currentUsers = object;
        fs.writeFile('currentUsers.json', JSON.stringify(currentUsers));
        fs.readFile('userRecords.json', 'utf8', function(err, data){
          var userRecordsObject = JSON.parse(data);
          delete userRecordsObject.solved[userName];
          delete userRecordsObject.assigned[userName];
          fs.writeFile('userRecords.json', JSON.stringify(userRecordsObject));
          res.redirect('/admin');
        });
  }

  fs.readFile('currentUsers.json', 'utf8', function(err, data){
    
    data ? currentUsers = JSON.parse(data) : currentUsers = {};
    currentUserNames = [];
    Object.values(currentUsers).forEach(function(object){
      currentUserNames.push(object.name);
    });
    currentUserNames.includes(userName) ? findUser(currentUsers, userName) : res.redirect('/admin?response=error404');
    });
  }
});

//Handle post requests from Admin console (add user)
app.post('/api/adduser', upload.single('img'), function(req, res){
  if (req.header('TOKEN') != token) {
    res.sendStatus(403);
  } else {
    
    var userInfo = JSON.parse(JSON.stringify(req.body));
    var userName = userInfo.username;
    var imgSrc = req.file.path.replace('public', '');

    fs.readFile('currentUsers.json', 'utf8', function(err, data){
      err && res.redirect('/admin/error=500');
      data ? currentUsers = JSON.parse(data) : currentUsers = {};
      var newUserId;
      var userIdArray = Object.keys(currentUsers);
      userIdArray.length != 0 ? newUserId = Number(userIdArray.pop()) + 1 : newUserId = 1;
      currentUsers[newUserId] = {"name": `${userName}`, "imgSrc": `${imgSrc}`};
      fs.writeFile('currentUsers.json', JSON.stringify(currentUsers));
      fs.readFile('userRecords.json', 'utf8', function(err, data){
        err && res.redirect('/admin/error=500');
        data ? userRecordObject = JSON.parse(data) : userRecordObject = {"solved": {}, "assigned": {}};
        userRecordObject.solved[userName] = 0;
        userRecordObject.assigned[userName] = 0;
        fs.writeFile('userRecords.json', JSON.stringify(userRecordObject));
        res.end()
        });
      });
    }
});

//Handle post requests from Zendesk
app.post('/api/post', parseJSON, function(req, res){
  
  var userObject = req.body;
  fs.readFile('currentUsers.json', 'utf8', function(err, data){
      
      currentUsers = Object.values(Object.values(JSON.parse(data)));
      currentUserNames = [];
      currentUsers.forEach(function(user){
        currentUserNames.push(user.name);
      });

      console.log(currentUserNames);
      
      
      fs.readFile('userRecords.json', 'utf8', function(err, data){
        //Ensure that user in POST request is listed in the currentUsers object
	
        var userAction = Object.keys(userObject)[0];
        var userName = Object.values(userObject)[0];
        console.log(userName);
        userRecords = JSON.parse(data);
        currentUserNames.includes(userName) ? userRecords[userAction][userName] += 1 : console.log("User not found");
        fs.writeFile('userRecords.json', JSON.stringify(userRecords));
        
        fs.readFile('dailyGoal.json', 'utf8', function(err, data){
            console.log(data);
            var data = JSON.parse(data);
            if (userAction === data.ticketType) {
              data.ticketsCompleted = Number(data.ticketsCompleted) + 1;
              fs.writeFile('dailyGoal.json', JSON.stringify(data), (err) => {
		            console.log(err);
		          });
              res.status(201).send("Success");
            } else {
              res.status(202).send("Success")
            }
          });
        });
      });
    });

//Listen to port 
app.listen(3000);
console.log(`Server running`);