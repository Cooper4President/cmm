/*
Run this with command 'node server-main.js'.
Then, go to 'localhost:####' in browser, where #### is the port number
*/

//for the 'express' library
var express = require('express');
var app = express();
//handlebars framework
var handlebars = require('handlebars');
//nodejs crypto module
var crypto = require('crypto');
/*
tell express to use the 'client' folder as a source of static files such as
index.html, index.css, etc...
*/
app.use(express.static('client'));
//create nodejs server
var server = require('http').Server(app);
//for the 'socket.io' library
var io = require('socket.io')(server);

var fs = require('fs');

//port number that the server listens on
var portNum = 3000;
//number of active socket connections
var numConnections = 0;
//active session tokens and their associated usernames
var activeUsers = {};

//TEMPORARY. Used for testing until the actual database is ready.
var TESTINGuserAccounts = {};
TESTINGuserAccounts['johnsmith'] = 'mypass123';
TESTINGuserAccounts['hello'] = 'world';
TESTINGuserAccounts['1337hacker'] = 'p@ssw0rd';
TESTINGuserAccounts['student3'] = 'thisISaPASSWORD';


//this is called when a socket is connected
io.on('connection', function(socket){
  var socketId = socket.id;
  var userIp = socket.request.connection.remoteAddress;

  console.log('user connected from ' + userIp +' to socket ' + socketId);
  numConnections++;
  console.log('total connected users: ' + numConnections);

  //login event
  socket.on('login attempt',function(userInfo){
    console.log('user attempting to login...\n' +
    'user: ' + userInfo.username + ' pass: ' + userInfo.password);

    var loginSuccess = false;
    for(var key in TESTINGuserAccounts){
      //if the username exists in the database...
      if(key == userInfo.username){
        //if the password matches the username...
        if(TESTINGuserAccounts[key] == userInfo.password){
          loginSuccess = true;
          break;
        }
      }
    }

    if(loginSuccess){
      //TEMPORARY. Generate random hash to be the 'token' for this user session
      var randStr = Math.random().toString();
      var token = crypto.createHash('md5').update(randStr).digest('hex');
      //add user to list of active sessions
      activeUsers[token] = userInfo.username;
      console.log('generated token: ' + token +
      ' for user: ' + userInfo.username);
      //give client the token
      io.emit('login success', token);
      //redirect client to chat page
      io.emit('page load');
    }
    else{
      //login failed
      io.emit('login fail');
      console.log('login failed...\n' + 'user: ' + userInfo.username +
      ' pass: ' + userInfo.password);
    }
  });

  //called when socket is disconnected
  socket.on('disconnect', function(){
    console.log('user disconnected from ' + userIp);
    numConnections--;
    console.log('total connected users: ' + numConnections);
  });
});


//start the server
server.listen(portNum, function(){
  console.log('server listening on port ' + portNum);
});
