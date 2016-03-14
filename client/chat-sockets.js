var socket = io();


//send auth token to server
function sendAuthToken(){
  socket.emit('auth attempt', $.cookie('authToken'));
}

//called when user submits a chat message, to send it to server
function sendChatMsg(chatId, chatReceivers, chatMsg){
  //chatId - ID of the chat 'thread' this message belongs to
  //chatReceivers - list (array) of usernames who should receive the message
  //chatMsg - contents of the message

  socket.emit('chat submit', { id: chatId, receivers: chatReceivers, msg: chatMsg });
}

//occurs when the server delivers a chat message to the client
socket.on('chat deliver', function(msgData){
  //msgData.sender - username of who sent the message
  //msgData.msg - contents of the message

  //TEMPORARY: placeholder for actual functionality
  alert(msgData.sender + ' sent you a message:\n' + msgData.msg);
});
