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
	var date = new Date();
	var testAccount = {username: date.getTime(),  password: 'pass'};

	

	var socket = io();
	
	//sending new user to server

	var accountCreate = false;

	//gets called when account creation is a success

	QUnit.test('testing account creation', function(assert){

		var done = assert.async();


		socket.emit('account create attempt', testAccount);
		socket.on('account create success', function(){
			assert.ok(true);
			done();
		});

	});

	QUnit.test('testing duplicate account creation', function(assert){

		var done = assert.async();


		socket.emit('account create attempt', testAccount);
		socket.on('account create fail', function(){
			assert.ok(true);
			done();
		});

	});

	QUnit.test('testing login', function(assert){

		var done = assert.async();

		socket.emit('login attempt', testAccount);

		socket.on('login success', function(token){
			assert.ok(token);
			done();
		});
	});
	QUnit.load();
	QUnit.start();
});