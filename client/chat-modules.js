requirejs.config({
    baseUrl: 'js',
    paths: {
        bower_components: '../bower_components',
        jquery: 'http://code.jquery.com/jquery-2.2.0.js',
        socket_io: 'https://cdn.socket.io/soket.io-1.4.5.js',
        handlebars: 'https://cdn.jsdelivr.net/handlebarsjs/4.0.5/handlebars.min.js',
        jqueryui: 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js'
    }
});

requirejs([
    'jquery', 
    'socket_io', 
    'handlebars', 
    'jqueryui', 
    'chat.js', 
    'commands.js', 
    'chat-sockets.js', 
    'messenger-template.js', 
    'bower_components/autogrow/autogrow.js',
    'bower_components/jquery.cookie/jquery.cookie.js',
    'bower_components/lodash/lodash.js'
    ],function($){console.log("jya")});