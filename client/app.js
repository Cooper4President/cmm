requirejs.config({
    baseUrl: 'js/app',
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        socket_io: '//cdn.socket.io/socket.io-1.4.5',
        hbs: '../bower_components/require-handlebars-plugin/hbs',
        jqueryui: '../bower_components/jquery-ui/jquery-ui',
        lodash: '../bower_components/lodash/lodash',
        autogrow: '../bower_components/autogrow/autogrow',
        jquery_cookie: '../bower_components/jquery.cookie/jquery.cookie'
    },
    shim: {
    	autogrow: ['jquery'],
    	jquery_cookie: ['jquery'],
    	jqueryui: ['jquery']
    }
});

requirejs(['appMain'], function(main){
   main();
});