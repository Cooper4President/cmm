/**
Run this with command 'node server-main.js'.
Then, go to 'localhost:####' in browser, where #### is the port number
*/

/** for the 'express' library */
var express = require('express');
var app = express();
/** nodejs crypto module */
var crypto = require('crypto');
/**
tell express to use the 'client' folder as a source of static files such as
index.html, index.css, etc...
*/
app.use(express.static('client'));
/** create nodejs server*/
var server = require('http').Server(app);
/** for the 'socket.io' library*/
var io = require('socket.io')(server);
/** filesystem*/
var fs = require('fs');
/** the sql database interface*/
var cmmsql = require('./cmmsql.js');
/** create new object for the sql database*/
var db = new cmmsql('cmm.db');

//for wolfram alpha api, used in --wolfram command
var wolfram = require('wolfram-alpha').createClient("6JXTUY-T4HRKH26ER");

/** port number that the server listens on*/
var portNum = 3000;
/** list of active session tokens and their associated usernames*/
/** usage: activeUsers[token] = username;*/
var activeUsers = {};
var numActiveUsers = 0;
/** list of connected socket IDs, their authentication status, client IP address,
and associated username (if authenticated)
usage: activeSockets[socketId].authenticated = true/false;
usage: activeSockets[socketId].clientIp = ipAddress;
usage: activeSockets[socketId].username = username;
*/
var activeSockets = {};
var numActiveSockets = 0;


/** this is called when a socket is connected */
io.on('connection', function(socket) {
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


/** start the server */
server.listen(portNum, function() {
    console.log('server listening on port ' + portNum);
});



/**
container to hold the socket event functions which are registered as callbacks
when a socket is connected
*/
function registerEventFuncs(socket, socketId, clientIp) {
    /** sent by client to request that a new user account be created */
    socket.on('account create attempt', function(userInfo) {
        console.log('request to create new account with details:\n' +
            'user: ' + userInfo.username + ' pass: ' + userInfo.password);


        /** send request to database to create the new account */
        db.adduser(userInfo.username, userInfo.password, function(err, result) {
            if (err) {
                //there was a problem creating the new account
                //notify the client
                console.log('account creation failed');
                socket.emit('account create fail');
            } else {
                contact = 'success';
                //new account created successfully in database
                //notify the client
                console.log('account successfully created');
                socket.emit('account create success');
            }
        });
    });

    /** authentication event (NOT to be confused with login event) */
    socket.on('auth attempt', function(token) {
        for (var key in activeUsers) {
            //if the token represents a currently logged-in user...
            if (key == token) {
                //mark the socket as authenticated and associate a username with it
                activeSockets[socketId].authenticated = true;
                activeSockets[socketId].username = activeUsers[token];
                console.log('socket: ' + socketId + ' authenticated by token: ' +
                    token + ' for username: ' + activeUsers[token]);
                break;
            }

        }
    });

    socket.on('chat log request', function(chatRoomId){
      db.getroomlog(chatRoomId, function(err, chatRoomLog){
        socket.emit('chat log deliver', {chatRoomId: chatRoomLog, logData: chatRoomId });  
      });
    });

    /** called when a client submits a chat message to the server */
    socket.on('chat submit', function(msgData) {
        //user who is authenticated on this socket is the sender of the message
        var chatSenderUsername = activeSockets[socketId].username;

        //TESTING
        console.log(chatSenderUsername + ' submitted to chat id: ' + msgData.chatRoomId +
            ' \nthis message: ' + msgData.msg);
        console.log('rec ' + msgData.receivers);

        //send the message to the receiving users if they are logged in
        msgData.receivers.push(chatSenderUsername);
        for (var i in msgData.receivers) {
            for (var j in activeSockets) {
                if (msgData.receivers[i] === activeSockets[j].username) {
                    io.to(j).emit('chat deliver', { chatRoomId: msgData.chatRoomId, sender: chatSenderUsername, msg: msgData.msg });

                    break;
                }
            }
        }
        //log the message to the database
        db.logroom(msgData.chatRoomId, chatSenderUsername, msgData.msg, function(err, result) {
            if (err) {
                console.log('error logging message to database with chatRoomId: ' +
                    msgData.chatRoomId);
            } else {
                //message logged to database successfully
            }
        });
    });

    /** occurs when the client requests to add a user to another user's friend list */
    socket.on('friend add', function(addFriendData) {
        //send information to the database
        db.addfriend(addFriendData.friend, addFriendData.user, function(err, result) {
            //done

            //now send the updated friends list to the user
            db.getfriends(activeSockets[socketId].username, function(err, friendList) {
              console.log(friendList);
                var friendObjList = {};

                for (var key in friendList) {
                    var friendObj = {};
                    friendObj.username = key;
                    friendObj.isOnline = false;

                    //check to see if the friend is online
                    for (var t in activeUsers) {
                        if (activeUsers[t] === key) {
                            friendObj.isOnline = true;
                            break;
                        }
                    }

                    //add friend object to list
                    friendObjList.push(friendObj);
                }

                //send data to the client
                socket.emit('friend list deliver', { user: username, friends: friendObjList });
            });
        });
    });

    /** occurs when client requests a user's friend list */
    socket.on('friend list request', function(username) {
        //get friend list from the database
        db.getfriends(username, function(err, friendList) {
            var friendObjList = {};

            for (var key in friendList) {
                var friendObj = {};
                friendObj.username = key;
                friendObj.isOnline = false;

                //check to see if the friend is online
                for (var t in activeUsers) {
                    if (activeUsers[t] === key) {
                        friendObj.isOnline = true;
                        break;
                    }
                }

                //add friend object to list
                friendObjList.push(friendObj);
            }

            //send data to the client
            socket.emit('friend list deliver', { user: username, friends: friendObjList });
        });
    });

    /** login event (NOT to be confused with authentication event) */
    socket.on('login attempt', function(userInfo) {
        console.log('user attempting to login...\n' +
            'user: ' + userInfo.username + ' pass: ' + userInfo.password);

        //query the database to check the user's account details
        db.listusers('mainroom', function(err, usersInDb) {
            //make sure that an account with the username exists
            var usernameExists = false;
            for (var key in usersInDb) {
                if (userInfo.username === usersInDb[key].user) {
                    usernameExists = true;
                    break;
                }
            }
            //username exists, so now we need to verify password
            if (usernameExists) {
                //query the db for the password associated with the account
                db.getpassword(userInfo.username, function(err, correctPassword) {
                    //password provided by client matches password in databse
                    if (userInfo.password === correctPassword) {
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

                        //notify user's friends that they are now online
                        for(var key in activeSockets){
                          if(activeSockets[key].username !== null){
                            db.getfriends(activeSockets[key].username, function(err, friendList){
                              for(var friendName in friendList){
                                if(friendName === userInfo.username){
                                  io.to(key).emit('friend online', friendName);
                                  break;
                                }
                              }
                            });
                          }
                        }
                      }
                    //client entered incorrect password
                    else {
                        //login failed
                        socket.emit('login fail');
                        console.log('login failed...\n' + 'user: ' + userInfo.username +
                            ' pass: ' + userInfo.password);
                    }
                });
            }
            //username does not exist in the database
            else {
                //login failed because username does not exist in the database
                socket.emit('login fail');
                console.log('login failed...\n' + 'user: ' + userInfo.username +
                    ' pass: ' + userInfo.password);
            }
        });

    });

    /** used when a user requests to be logged out */
    socket.on('logout', function(token) {
        console.log(activeUsers);
        console.log('attempting to logout ' + token);
        for (var key in activeUsers) {
            //if user is in list of active users...
            if (key == token) {
                //remove user from list of active users
                delete activeUsers[token];
                //set the socket status to not-authenticated
                activeSockets[socketId].authenticated = false;
                console.log(token + ' logged out');
                socket.emit('logout success');
                break;
            }
        }
    });

    /** used when a user requests to create a new chatroom */
    socket.on('room create request', function(roomInfo) {
        //roomInfo.chatReceivers - list of usernames who are to be included in room
        //roomInfo.isPrivate - true/false whether the room should be set to private
        var chatCreator = activeSockets[socketId].username;
        console.log(roomInfo);
        roomInfo.chatReceivers.push(chatCreator);
        roomInfo.chatReceivers.sort();

        //Generate hash of receiver names to act as the unique ID
        var strToHash = "";
        for (var key in roomInfo.chatReceivers) {
            strToHash += roomInfo.chatReceivers[key];
        }
        var chatRoomId = crypto.createHash('md5').update(strToHash).digest('hex');

        //user who is creating the chatroom

        //tell the database to create a new chatroom with these users
        db.createroom(chatRoomId, roomInfo.chatReceivers, chatCreator, roomInfo.isPrivate,
            function(err, result) {
                //tell the client the room has been created
                socket.emit('room create success', chatRoomId);
            });
    });

    /** called when a user requests the list of all registered usernames */
    socket.on('user list request', function() {
        //get userlist from database
        db.listusers('mainroom', function(err, usersInDb) {
           usersInDb.forEach(function(elm){
                var users = usersInDb.slice();
                users.splice(users.indexOf(elm), 1);
                for(var key in activeSockets){
                    if(elm.user === activeSockets[key].username){
                        console.log('sending '+elm.user+' user list ');
                        console.log(users);
                        io.to(key).emit('user list deliver', users);
                    }
                }
            });
            // console.log(usersInDb);
            // var users = usersInDb;
            // users.forEach(function(obj){
            //     if(obj.user === activeSockets[socketId].username ) users.splice(users.indexOf(obj), 1);
            // });
            // console.log(users);
            // //send userlist to the client
            // socket.emit('user list deliver', users);
            // usersInDb.forEach(function(ent){
            //     for(var key in activeSockets){
            //         console.log('current user ' + activeSockets[socketId].username);
            //         if(key !== socketId && activeSockets[key].username !== null){
            //             var u = usersInDb;
            //             u.splice(users.indexOf(activeSockets[key].username), 1);
            //             io.to(key).emit('user list deliver', u);
            //         }else{
            //             console.log('do not send to ' + activeSockets[key].username);
            //         }
            //     }
            // });
        });
    });

    /** called when socket is disconnected */
    socket.on('disconnect', function() {
        //remove socket from list of connected sockets
        delete activeSockets[socketId];

        numActiveSockets--;
        console.log('socket disconnected: ' + clientIp);
        console.log('total connected sockets: ' + numActiveSockets);
    });

    socket.on('wolfram', function(inp) {
        wolfram.query(inp, function(err, result) {
            if (err) socket.emit("wolfram error");
            else {
                console.log(result);
                socket.emit("wolfram success", result);
            }
        });
    });
}
