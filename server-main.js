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


//this is called when a socket is connected
io.on('connection', function(socket){
  var socketId = socket.id;
  var clientIp = socket.request.connection.remoteAddress;

  //add socket to list of connected sockets
  activeSockets[socketId] = {};
  activeSockets[socketId].authenticated = false;
  activeSockets[socketId].clientIp = clientIp;
  activeSockets[socketId].username = null;

  numActiveSockets++;
  console.log('connected: ' + clientIp);
  console.log('total connected sockets: ' + numActiveSockets);

  //register event function callbacks
  registerEventFuncs(socket, socketId, clientIp);
});


//start the server
server.listen(portNum, function(){
  console.log('server listening on port ' + portNum);
});



/*
container to hold the socket event functions which are registered as callbacks
when a socket is connected
*/
function registerEventFuncs(socket, socketId, clientIp){
  //*****event functions*****


    //sent by client to request that a new user account be created
    socket.on('account create attempt', function(userInfo){
      //testing
      console.log('request to create new account with details:\n' +
      'user: ' + userInfo.username + ' pass: ' + userInfo.password);

      //send request to database to create the new account
      db.adduser(userInfo.username, userInfo.password, function(err, result){
        if(err){
          //there was a problem creating the new account
          //notify the client
          socket.emit('account create fail');
        }
        else{
          //new account created successfully in database
          //notify the client
          socket.emit('account create success');
        }
      });
    });

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

  //called when a client submits a chat message to the server
  socket.on('chat submit', function(msgData){
    //user who is authenticated on this socket is the sender of the message
    var chatSenderUsername = activeSockets[socketId].username;

    //TESTING
    console.log(chatSenderUsername + ' submitted to chat id: ' + msgData.id +
    ' \nthis message: ' + msgData.msg);
    console.log('rec ' + msgData.receivers);

    //send the message to the receiving users if they are logged in
    for(var i in msgData.receivers){
      for(var j in activeSockets){
        if(msgData.receivers[i] === activeSockets[j].username){
          socket.emit('chat deliver',
          { chatRoomId: msgData.chatRoomId, sender: chatSenderUsername, msg: msgData.msg });

          break;
        }
      }
    }

    //log the message to the database
    db.logroom(msgData.chatRoomId, chatSenderUsername, msgData.msg, function(err, result){
      if(err){
        console.log('error logging message to database with chatRoomId: ' +
        msgData.chatRoomId);
      }
      else{
        //message logged to database successfully
      }
    });
  });

  //login event (NOT to be confused with authentication event)
  socket.on('login attempt', function(userInfo){
    console.log('user attempting to login...\n' +
    'user: ' + userInfo.username + ' pass: ' + userInfo.password);

    //query the database to check the user's account details
    db.listusers('mainroom', function(err, usersInDb){
      //make sure that an account with the username exists
      var usernameExists = false;
      for(var key in usersInDb){
        if(userInfo.username === usersInDb[key].user){
          usernameExists = true;
          break;
        }
      }
      //username exists, so now we need to verify password
      if(usernameExists){
        //query the db for the password associated with the account
        db.getpassword(userInfo.username, function(err, correctPassword){
          //password provided by client matches password in databse
          if(userInfo.password === correctPassword){
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
          //client entered incorrect password
          else{
            //login failed
            socket.emit('login fail');
            console.log('login failed...\n' + 'user: ' + userInfo.username +
            ' pass: ' + userInfo.password);
          }
        });
      }
      //username does not exist in the database
      else{
        //login failed because username does not exist in the database
        socket.emit('login fail');
        console.log('login failed...\n' + 'user: ' + userInfo.username +
        ' pass: ' + userInfo.password);
      }
    });

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

  //used when a user requests to create a new chatroom
  socket.on('room create request', function(chatReceivers){
    //TEMPORARY. Generate random hash to be the unique room id
    var randStr = Math.random().toString();
    var chatRoomId = crypto.createHash('md5').update(randStr).digest('hex');

    //user who is creating the chatroom
    var chatCreator = activeSockets[socketId].username;

    //whether the chatroom should be set to private
    var roomIsPrivate = false;

    //tell the database to create a new chatroom with these users
    db.createroom(chatRoomId, chatReceivers, chatCreator, roomIsPrivate, function(err, result){
      if(!err){
        //tell the client the room has been created
        socket.emit('room create success', chatRoomId);
      }
      else{
        //error creating room, maybe it already exists?
        console.log('error creating room');
      }
    });
  });

  //called when socket is disconnected
  socket.on('disconnect', function(){
    //remove socket from list of connected sockets
    delete activeSockets[socketId];

    numActiveSockets--;
    console.log('socket disconnected: ' + clientIp);
    console.log('total connected sockets: ' + numActiveSockets);
  });
}
