define(['jquery', './animations'], function($, animation){
	return function (){
		//shows login window
		$('.login-op').on('click', function(event){
			animation.top('start').center('login');
		});
		//shows sign up window
		$('.sign-up-op').on('click', function(event){
			animation.bottom('start').center('sign-up');
		});	
	}
});