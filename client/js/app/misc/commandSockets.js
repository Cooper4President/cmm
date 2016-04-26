define(['jquery', 'socket_io'], function($, io){
	var socket = io();

	return {
        wolframQuery: function(inp, callback) {
            socket.emit('wolfram', inp);
            socket.on('wolfram success', function(result) {
                console.log(result);
                callback(result);
                socket.removeListener('wolfram success'); //remove listener after use
            });
        }
	};

});