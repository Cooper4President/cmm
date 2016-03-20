define(['jquery', './animations'], function($, animation){
	return function (){
		$('.login-op').on('click', function(event){
			animation.top('start').center('login');
		});

		$('.sign-up-op').on('click', function(event){
			animation.bottom('start').center('sign-up');
		});	
	}
});