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
//filesystem
var fs = require('fs');

//the sql database interface
var cmmsql = require('./cmmsql.js');
//create new object for the sql database
var db = new cmmsql('cmm.db');


//port number that the server listens on
var portNum = 3000;
//list of active session tokens and their associated usernames
//usage: activeUsers[token] = username;
var activeUsers = {};
var numActiveUsers = 0;
/*list of connected socket IDs, their authentication status, client IP address,
and associated username (if authenticated)*/
//usage: activeSockets[socketId].authenticated = true/false;
//usage: activeSockets[socketId].clientIp = ipAddress;
//usage: activeSockets[socketId].username = username;
var activeSockets = {};
var numActiveSockets = 0;

//TEMPORARY. Used for testing until the actual database is ready.
var TESTINGuserAccounts = {};
TESTINGuserAccounts['johnsmith'] = 'mypass123';
TESTINGuserAccounts['hello'] = 'world';
TESTINGuserAccounts['1337hacker'] = 'p@ssw0rd';
TESTINGuserAccounts['student3'] = 'thisISaPASSWORD';


//this is called when a socket is connected
io.on('connection', function(socket){
  var socketId = socket.id;
  var clientIp = socket.request.connection.remoteAddress;

  //add socket to list of connected sockets
  activeSockets[socketId] = {};
  activeSockets.authenticated = false;
  activeSockets.clientIp = clientIp;
  activeSockets.username = null;

  numActiveSockets++;
  console.log('connected: ' + clientIp);
  console.log('total connected sockets: ' + numActiveSockets);

  //event functions

  //authentication event (NOT to be confused with login event)
  socket.on('auth attempt', function(token){
    for(var key in activeUsers){
      //if the token represents a currently logged-in user...
      if(key == token){
        //mark the socket as authenticated and associate a username with it
        activeSockets[socketId].authenticated = true;
        activeSockets[socketId].username = activeUsers[token];
        console.log('socket: ' + socketId + ' authenticated by token: ' +
        token + ' for username: ' + activeUsers[token]);
        break;
      }
    }
  });

  //login event (NOT to be confused with authentication event)
  socket.on('login attempt', function(userInfo){
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

      console.log('user login. generated token: ' + token +
      ' for user: ' + userInfo.username);
      numActiveUsers++;
      console.log('total logged-in users: ' + numActiveUsers);

      //give client the token
      socket.emit('login success', token);
      //redirect client to chat page
      socket.emit('page load');
    }
    else{
      //login failed
      socket.emit('login fail');
      console.log('login failed...\n' + 'user: ' + userInfo.username +
      ' pass: ' + userInfo.password);
    }
  });

  //used when a user requests to be logged out
  socket.on('logout', function(token){
    for(var key in activeUsers){
      //if user is in list of active users...
      if(key == token){
        //remove user from list of active users
        delete activeUsers[token];
        //set the socket status to not-authenticated
        activeSockets[socketId].authenticated = false;

        break;
      }
    }
  });

  //called when socket is disconnected
  socket.on('disconnect', function(){
    //remove socket from list of connected sockets
    delete activeSockets[socketId];

    numActiveSockets--;
    console.log('socket disconnected: ' + clientIp);
    console.log('total connected sockets: ' + numActiveSockets);
  });
});


//TESTING for the sql db
db.listusers('mainroom');


//start the server
server.listen(portNum, function(){
  console.log('server listening on port ' + portNum);
});
