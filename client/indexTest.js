require.config({
	baseUrl: 'js/home',
	paths: {
		QUnit: '../bower_components/qunit/qunit/qunit',
		jquery: '../bower_components/jquery/dist/jquery',
        socket_io: '//cdn.socket.io/socket.io-1.4.5'
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

requirejs(['QUnit', 'socket_io'], function(QUnit, io){
	var testAccount = {username: 'test8',  password: 'pass8'};

	

	var socket = io();
	
	//sending new user to server

	var accountCreate = false;

	//gets called when account creation is a success

	QUnit.test('testing account functions', function(assert){

		var done = assert.async();
		socket.emit('account create attempt', testAccount);
		//expect(0);
		//makes sure is true
		socket.on('account create success', function(){
			assert.ok(true);
			done();
		});
		//assert.ok(accountCreate);
	});
	QUnit.load();
	QUnit.start();
});