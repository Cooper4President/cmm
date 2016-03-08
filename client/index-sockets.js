var socket = io();


function sendUser(user, pass){
	socket.emit('login attempt', { username: user, password: pass });
}

socket.on('login success', function(token){
	//user login credentials accepted, server has sent an auth token
	//save the auth token locally in a cookie
	$.cookie('authToken', token, { path: '/' });
});

socket.on('login fail', function(){
	//user login credentials were not accepted by the server

	//TEMPORARY. Replace this with whatever you want to happen when login fails.
	alert('Login failed! Check username/password and make sure account exists.');
});

socket.on('page load', function(){
	$(location).attr('href',"http://localhost:3000/chat.html");
});
