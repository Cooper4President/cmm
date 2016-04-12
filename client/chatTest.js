require.config({
    baseUrl: 'js/app',
    paths: {
        QUnit: '../bower_components/qunit/qunit/qunit',
        jquery: '../bower_components/jquery/dist/jquery',
        socket_io: '//cdn.socket.io/socket.io-1.4.5',
        hbs: '../bower_components/require-handlebars-plugin/hbs',
        jqueryui: '../bower_components/jquery-ui/jquery-ui',
        lodash: '../bower_components/lodash/lodash',
        autogrow: '../bower_components/autogrow/autogrow',
        jquery_cookie: '../bower_components/jquery.cookie/jquery.cookie',
        select2: '../bower_components/select2/dist/js/select2.min'
    },
    shim: {
        'QUnit': {
            exports: 'QUnit',
            init: function() {
                QUnit.config.autoload = false;
                QUnit.config.autostart = false;
            }
        }
    }
});

requirejs(['jquery', 'QUnit', 'testing/commandTesting'], function($, QUnit, commandTesting) {

    commandTesting();

    QUnit.load();
    QUnit.start();
});
