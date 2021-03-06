/** @memberOf jQuery */

/** @module chatSockets */

/**
 * @fileOverview Defines sockets to communicate with server
 * @author Oliver Ehrhardt <oleh1308@colorado.edu>
 */
    

define([
    'jquery',
    'socket_io',
    'hbs!templates/userList',
    'hbs!templates/message',
    'messenger/commands',
    'misc/user',

    //jquery plug ins
    'notify',
    'jquery_cookie'
], function($, io, userList, message, commands, user) {
    var socket = io();

        //checks if chat box is overflowed
    /**
     * @param  {object} container with the scroll bar that needs checking
     * @return {null}
     */
    function checkScrollbar(container) {
        var elt, hasOverflow = (elt = container).innerWidth() > elt[0].scrollWidth;
        if (hasOverflow) container.scrollTop(container[0].scrollHeight);
    }

    //occurs when the server responds to the request for room log
    socket.on('chat log deliver', function(logData) {
        //logData.chatRoomId - unique ID of the chat 'thread' this message belongs to
        //logData.log - the logged message history of this chatroom

        //TEMPORARY: placeholder for actual functionality
        console.log('Log received from server for chatRoomId: ' + logData.chatRoomId + 'with log ');
        console.log(logData.log);
    });

    //occurs when the server delivers a chat message to the client
    /**
     * @param  {object} contains data about the nature of the message
     * @return {null}
     */
    socket.on('chat deliver', function(msgData) {
        //msgData.chatRoomId - unique ID of the chat 'thread' this message belongs to
        //msgData.sender - username of who sent the message
        //msgData.msg - contents of the message

        //TEMPORARY: placeholder for actual functionality
        //run message as a command and post it to respective chat window
        console.log(msgData);
        var found = false;
        $('.chat').each(function(){
            if($(this).data('roomId') === msgData.chatRoomId){
                found = true;
                var container = $(this).find('.container');
                commands($(this).attr('id'), msgData.msg, function(envelope){
                    envelope.username = msgData.sender;
                    container.append(message(envelope)); //since the command module only returns a funciton we call it like this
                    checkScrollbar(container);      
                });
            }
        });

        if(!found){
            $.notify(msgData.sender + ' wishes to chat with you!', "info", { clickToHide: true});
        }
    });



    //occurs when the server delivers the list of registered usernames
    socket.on('user list deliver', function(list) {
        //list - list of all registered usernames
        $('.search').append(userList(list));
        user.people = list;
    });

    var api = {

        login: function(){
            socket.emit('user list request');
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
