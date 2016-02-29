/*
Run this with command 'node index.js'.
Then, go to 'localhost:####' in browser, where #### is the port number
*/

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);


//port number that the server listens on
var portNum = 3000;
//number of active socket connections
var numConnections = 0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
});

app.get('/chat.html', function(req, res){
  res.sendFile(__dirname + '/client/chat.html');
});

io.on('connection', function(socket){
  var socketId = socket.id;
  var userIp = socket.request.connection.remoteAddress;

  console.log('user connected from ' + userIp);
  numConnections++;
  console.log('total connected users: ' + numConnections);

  socket.on('chat message', function(msg){
    io.emit('chat message', '[' + userIp + '] ' + msg);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected from ' + userIp);
    numConnections--;
    console.log('total connected users: ' + numConnections);
  });
});

server.listen(portNum, function(){
  console.log('server listening on port ' + portNum);
});
