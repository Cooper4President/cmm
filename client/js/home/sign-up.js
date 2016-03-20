define(['jquery', './animations'], function($, animation){
	return function(){
		//switches to login window
		$('.login-re').on('click', function(event){
			animation.top('sign-up').center('login');
		});
	}
});