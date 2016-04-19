/*
	Defines sockets to communicate with server
*/

define([
    'jquery',
    'socket_io',

    //jquery plug ins
    'jquery_cookie'
], function($, io) {
    var socket = io();


    //occurs when the server responds to the request for room log
    socket.on('chat log deliver', function(logData) {
        //logData.chatRoomId - unique ID of the chat 'thread' this message belongs to
        //logData.log - the logged message history of this chatroom

        //TEMPORARY: placeholder for actual functionality
        alert('Log received from server for chatRoomId: ' + logData.chatRoomId);
    });

    //occurs when the server delivers a chat message to the client
    socket.on('chat deliver', function(msgData) {
        //msgData.chatRoomId - unique ID of the chat 'thread' this message belongs to
        //msgData.sender - username of who sent the message
        //msgData.msg - contents of the message

        //TEMPORARY: placeholder for actual functionality
        alert(msgData.sender + ' sent you a message:\n' + msgData.msg);
    });

    socket.on('user list deliver', function(userList){
      //userList - list of all registered usernames
      
      //TEMPORARY: placeholder for actual functionality
      alert('User list received from server');
    });



    return {
        //request server for log of messages from a chatroom
        requestChatRoomLog: function(chatRoomId) {
            socket.emit('chat log request', chatRoomId);
        },

        //request server for list of all registered users
        requestUserList: function() {
          socket.emit('user list request');
        },

        //request server to create a new chatroom
        //server will respond with the unique room id once it is created
        requestRoomId: function(chatReceivers, isPrivate, createRoom) {
            //chatReceivers - list of usernames who are to be included in room
            //isPrivate - true/false whether the room should be set to private
            socket.emit('room create request', {
                chatReceivers: chatReceivers,
                isPrivate: isPrivate
            });
            //occurs when the server has created a new chatroom and sent the unique id
            socket.on('room create success', function(chatRoomId) {
                createRoom(chatRoomId);
                socket.removeListener('room create success');
            });
        },

        //send auth token to server
        sendAuthToken: function() {
            socket.emit('auth attempt', $.cookie('authToken'));
        },

        //called when user submits a chat message, to send it to server
        sendChatMsg: function(chatRoomId, chatReceivers, chatMsg) {
            //chatRoomId - unique ID of the chat 'thread' this message belongs to
            //chatReceivers - list (array) of usernames who should receive the message
            //chatMsg - contents of the message

            socket.emit('chat submit', {
                chatRoomId: chatRoomId,
                receivers: chatReceivers,
                msg: chatMsg
            });
        }
    };

});
