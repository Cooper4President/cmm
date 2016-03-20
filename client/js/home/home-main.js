define(['./login', './animations'],function(login, animation){
	return function(){
		login.init();

		animation.center('start').bottom('login').top('sign-up');

		$('.login-op').on('click', function(event){
			animation.top('start').center('login');
		});

		$('.sign-up-op').on('click', function(event){
			animation.bottom('start').center('sign-up');
		});

		$('.sign-up-re').on('click', function(event){
			animation.bottom('login').center('sign-up');
		});
		$('.login-re').on('click', function(event){
			animation.top('sign-up').center('login');
		});
	}
});