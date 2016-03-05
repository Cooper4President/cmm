var socket = io();


function sendAuthToken(){
  socket.emit('auth attempt', $.cookie('authToken'));
}
