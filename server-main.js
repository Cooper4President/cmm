/*
Run this with command 'node server-main.js'.
Then, go to 'localhost:####' in browser, where #### is the port number
*/

//for the 'express' library
var express = require('express');
var handlebars = require('handlebars');
var app = express();
/*
tell express to use the 'client' folder as a source of static files such as
index.html, index.css, etc...
*/
app.use(express.static('client'));
//create nodejs server
var server = require('http').Server(app);
//for the 'socket.io' library
var io = require('socket.io')(server);


//port number that the server listens on
var portNum = 3000;
//number of active socket connections
var numConnections = 0;


//this is called when a socket is connected
io.on('connection', function(socket){
  var socketId = socket.id;
  var userIp = socket.request.connection.remoteAddress;

  console.log('user connected from ' + userIp);
  numConnections++;
  console.log('total connected users: ' + numConnections);

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
