define(['socket_io'], function(io){

	var socket = io();


	//sent by server when attempt to create new user account succeeds
	socket.on('account create success', function(){
		//todo
	});

	//sent by server when attempt to create neww user account fails
	socket.on('account create fail', function(){
		//todo
	});

	//sent by server when login attempt succeeds
	socket.on('login success', function(token){
		//user login credentials accepted, server has sent an auth token
		//save the auth token locally in a cookie
		$.cookie('authToken', token, { path: '/' });
	});

	//sent by server when login attempt fails
	socket.on('login fail', function(){
		//user login credentials were not accepted by the server

		//TEMPORARY. Replace this with whatever you want to happen when login fails.
		alert('Login failed! Check username/password and make sure account exists.');
	});

	//redirect user to the chat page
	socket.on('page load', function(){
		$(location).attr('href', '/chat.html');
	});


	return{
		//send request to server asking to create new user account
		//the server will send back either a success or failure event
		function createAccount(user, pass){
			socket.emit('account create attempt', { username: user, password: pass });
		}

		//sends user login information to the server
		//the server will send back either a success or failure event
		function sendUser(user, pass){
			socket.emit('login attempt', { username: user, password: pass });
		}
	}

});
