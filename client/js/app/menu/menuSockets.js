define(['jquery', 'socket_io'], function($, io) {
    var socket = io();

    socket.on('logout success', function() {
        $(location).attr('href', '/index.html');
    });

    return {
        logout: function() {
            socket.emit('logout', $.cookie('authToken'));
        }
    };
});
