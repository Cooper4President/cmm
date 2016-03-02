var socket = io();


function sendUser(user, pass){
	socket.emit('login',user);
}

socket.on('page load', function(){
	$(location).attr('href',"http://localhost:3000/chat.html");
});