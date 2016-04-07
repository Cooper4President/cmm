require.config({
	baseUrl: 'js/app',
	paths: {
		QUnit: '../bower_components/qunit/qunit/qunit',
        jquery: '../bower_components/jquery/dist/jquery',
        lodash: '../bower_components/lodash/lodash',
        hbs: '../bower_components/require-handlebars-plugin/hbs',
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

requirejs(['jquery','QUnit', 'testing/commandTesting'], function($, QUnit, commandTesting){

	commandTesting();

	QUnit.load();
	QUnit.start();
});