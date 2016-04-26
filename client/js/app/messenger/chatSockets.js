/*
    Defines sockets to communicate with server
*/

define([
    'jquery',
    'socket_io',
    'hbs!templates/friendList',
    'hbs!templates/userList',
    'hbs!templates/message',
    'messenger/commands',

    //jquery plug ins
    'jquery_cookie'
], function($, io, friendList, userList, message, commands) {
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
        //run message as a command and post it to respective chat window
        console.log(msgData);
        $('.chat').each(function(){
            if($(this).data('roomId') === msgData.chatRoomId){
                var envelope = commands($(this).attr('id'), msgData.msg);
                envelope.username = msgData.sender;
                var container = $(this).find('.container');
                container.append(message(envelope)); //since the command module only returns a funciton we call it like this
                return;
            }
        });
    });

    socket.on('friend list deliver', function(friendData) {
        //friendData.user - username of the person who 'owns' this friend list
        //friendData.friends - list of friend's usernames

        //TEMPORARY: placeholder for actual functionality
        console.log(friendData);
        $('.friends').find('.list').append(friendList(friendData));
    });

    //occurs when the server delivers the list of registered usernames
    socket.on('user list deliver', function(list) {
        //list - list of all registered usernames
        $('.search').append(userList(list));
    });

    var api = {

        login: function(){
            socket.emit('friends list request');
            socket.emit('user list request');
            return api;
        },

        requestActiveUsers: function(callback) {
            socket.emit('active users request');
            return api;
        },

        //tell the server to add a user to another user's friend list
        addFriend: function(username, friendUsername) {
            //username - username of the 'owner' of the friends list
            //friendUsername - user to be added to the friends list

            socket.emit('friend add', { user: username, friend: friendUsername });
            return api;
        },
        //request server for log of messages from a chatroom
        requestChatRoomLog: function(chatRoomId) {
            socket.emit('chat log request', chatRoomId);
            return api;
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
            return api;
        },

        //send auth token to server
        sendAuthToken: function() {
            socket.emit('auth attempt', $.cookie('authToken'));
            return api;
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
            return api;
        }
    };

    return api;

});
