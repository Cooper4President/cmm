requirejs.config({
    baseUrl: 'js/home',
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        socket_io: '//cdn.socket.io/socket.io-1.4.5',
    }
});

requirejs(['homeMain'], function(main){
   main();
});