const fs = require('fs');
//Returns a function
const express = require('express');
const hostname = '127.0.0.1';
const port = 80;
const bodyParser = require('body-parser');
var parseJSON = bodyParser.json();
var app = express();
let currentUsers = {
  "username":"Lisa Zhang",
  "username":"Hannah Tatum",
  "username":"Zachary Smith",
  "username":"Joelle Waksman",
  "username":"Tim DaGraca",
  "username":"Katie Owens",
  "username":"Jacob Richard-Smith",
  "username":"Tyler Campbell"
};
let userRecords = {};


fs.readFile('userRecords.json', 'utf8', function(err, data){
   userRecords = JSON.parse(data);
});

// fs.readFile('currentUsers.json', 'utf8', function(err, data){
//    currentUsers = JSON.parse(data);
// });

// app.get('/', function(req, res){
//   res.sendFile('index.html', { root: __dirname + "/public"});
// });

// app.use('/public/stylesheets', express.static('stylesheets'));
// app.use('/public/scripts', express.static('scripts'));


app.use('/public', express.static('public'));

app.get('/userRecords', function(req, res){
    res.send(JSON.stringify(userRecords));
});


//Runs the function
//Static files



app.post('/', parseJSON, function(req, res){
  var userObject = req.body;
  fs.readFile('userRecords.json', 'utf8', function(err, data){
    userRecords = JSON.parse(data);
    console.log(userRecords);
    console.log(currentUsers);
    userRecords[userObject.name] += 1;
    fs.writeFile('userRecords.json', JSON.stringify(userRecords));
    res.status(201).send("Success");
 });
  // Object.values(currentUsers).includes(userObject.name) ? userRecords[userObject.name] += 1 : console.log("User does not exist");
  // console.log(userRecords[userObject.name]);
  // Object.values(currentUsers).includes(userObject.name) ? userRecords[userObject.name] += 1 : console.log("User does not exist");
  // console.log(userRecords[userObject.name]);
  // fs.writeFile('userRecords.json', JSON.stringify(userRecords));
  // res.status(201).send("Success");
})

//Run controllers
// dataController(app)

//Listen to port 
app.listen(80);
console.log(`Server running at http://${hostname}:${port}/`);



// const server = http.createServer(function(req, res){
//   switch (req.method) {
//     case 'GET':
//       if (req.url === '/'){
//         res.writeHead(200, {'Content-Type': 'text/html'});
//         fs.createReadStream(__dirname + '/index.html').pipe(res);
//         };
//       }
//     case 'POST':
//       break;
//     case 'PUT':
//       break;
//     case 'DELETE':
//       break;
//     default:
//       fs.readFile(req.url, function(err, data) {
//         console.log(err);
//         res.writeHead(200, {'Content-Type': 'text/html'});
//         res.write(data);
//         res.end();
//       });
        
    //   } else if (req.url.includes('.css')) {
    //     fs.readFile('stylesheets/main.css', function(err, data) {
    //       res.writeHead(200, {'Content-Type': 'text/css'});
    //       res.write(data);
    //       res.end();
    //   });
    //   } else if (req.url.includes('.js')) {
    //     fs.readFile('scripts/main.js', function(err, data) {
    //       res.write(data);
    //       res.end();
    //   });
    // }
//   }
// });


  

 
 
 
 
  // let body = [];
  // req.on('data', function(chunk){
  //   body.push(chunk);
  //   body.join('');
  // });
  // console.log(req.url.slice(1));
  // fs.readFile(req.url.slice(1), function(err, data) {
  //   // res.writeHead(200, {'Content-Type': 'text/html'});
  //   res.write(data);
  //   res.end();
  // });



  // fs.readFile('main.css', function(err, data) {
  //   res.writeHead(200, {'Content-Type': 'text/css'});
  //   res.write(data);
  //   res.end();
  // });



  
  

//   fs.readFile(req.url, function(err, data) {
//     // res.statusCode = 200;
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.write(data);
//     res.end();
//     // res.setHeader('Content-Type', 'text/plain');
//     // res.end('Hello World\n');
//     });
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });


