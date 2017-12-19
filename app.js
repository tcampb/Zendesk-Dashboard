var fs = require('fs');
var express = require('express');
var hostname = '127.0.0.1';
var port = 80;
var bodyParser = require('body-parser');
var parseJSON = bodyParser.json();
var parseURL = bodyParser.urlencoded({ extended: false });
var currentUsers = {};
var userRecords = {};
var midnight = "00:00:00";
var re = new RegExp('..:..:..');
var token = '<USER TOKEN>';
var multer  = require('multer')
var upload = multer({ dest: 'public/uploads/' });
var app = express();
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
    req.body && res.sendFile('/Users/tylercampbell/Desktop/calendly_dashboard_api/admin/admin.html');
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


app.post('/admin', parseURL, function(req, res){
  //Send admin page if authentication is successful
  req.body && res.sendFile('/Users/tylercampbell/Desktop/calendly_dashboard_api/admin/admin.html');
});

//Handle post request from Admin console (goals)
app.post('/api/setgoal', parseURL, function(req, res){
  if (req.header('TOKEN') != token) {
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
      console.log(res.data);
      var userName = JSON.parse(JSON.stringify(req.body));
      var userFound;
      userName = userName.username;
      console.log(userName);
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

//TEST
// app.post('/api/adduser', upload.single('img'), function(req, res){
//     console.log(req.file.path);
//     res.end();
// });

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
  console.log(req.headers);
  var userObject = req.body;
  fs.readFile('currentUsers.json', 'utf8', function(err, data){
      currentUsers = Object.values(Object.values(JSON.parse(data)));
      currentUserNames = [];
      currentUsers.forEach(function(user){
        currentUserNames.push(user.name);
      });
      
      
      fs.readFile('userRecords.json', 'utf8', function(err, data){
        //Ensure that user in POST request is listed in the currentUsers object
        var userAction = Object.keys(userObject)[0];
        var userName = Object.values(userObject)[0];
        userRecords = JSON.parse(data);
        currentUserNames.includes(userName) ? userRecords[userAction][userName] += 1 : console.log("User not found");
        fs.writeFile('userRecords.json', JSON.stringify(userRecords));
        
        fs.readFile('dailyGoal.json', 'utf8', function(err, data){
            var data = JSON.parse(data);
            if (userAction === data.ticketType) {
              data.ticketsCompleted = Number(data.ticketsCompleted) + 1;
              fs.writeFile('dailyGoal.json', JSON.stringify(data));
              res.status(201).send("Success");
            }
          }) 
        })
      })
    })

//Listen to port 
app.listen(80);
console.log(`Server running at http://${hostname}:${port}/`);