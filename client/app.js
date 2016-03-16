requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        jquery: '//code.jquery.com/jquery-2.2.0',
        socket_io: '//cdn.socket.io/socket.io-1.4.5',
        hbs: '../bower_components/require-handlebars-plugin/hbs',
        jqueryui: '//ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min',
        lodash: '../bower_components/lodash/lodash',
        autogrow: '../bower_components/autogrow/autogrow',
        jquery_cookie: '../bower_components/jquery.cookie/jquery.cookie'
    },
    hbs: {
    	templateExtension: 'handlebars'
    },
    shim: {
    	autogrow: ['jquery'],
    	jquery_cookie: ['jquery'],
    	jqueryui: ['jquery']
    }
});

requirejs(['main'], function(main){
   main();
});