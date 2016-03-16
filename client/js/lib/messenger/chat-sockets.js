
define(['jquery','socket_io','jquery_cookie'], function($, io){
	var socket = io();

	//occurs when the server delivers a chat message to the client
	socket.on('chat deliver', function(msgData){
	  //msgData.sender - username of who sent the message
	  //msgData.msg - contents of the message

	  //TEMPORARY: placeholder for actual functionality
	  alert(msgData.sender + ' sent you a message:\n' + msgData.msg);
	});

	return {
			//send auth token to server
		sendAuthToken: function (){
		  socket.emit('auth attempt', $.cookie('authToken'));
		},

		//called when user submits a chat message, to send it to server
		sendChatMsg: function (chatId, chatReceivers, chatMsg){
		  //chatId - ID of the chat 'thread' this message belongs to
		  //chatReceivers - list (array) of usernames who should receive the message
		  //chatMsg - contents of the message

		  socket.emit('chat submit', { id: chatId, receivers: chatReceivers, msg: chatMsg });
		}
	}
});

