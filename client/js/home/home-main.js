define(['./login', './start', './sign-up', './animations'],function(login, start, signUp, animation){
	return function(){
		animation.center('start').bottom('login').top('sign-up');
		login();
		start();
		signUp();
	}
});