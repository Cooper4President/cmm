define(['jquery', './animations'], function($, animation){
	return function(){
		$('.login-re').on('click', function(event){
			animation.top('sign-up').center('login');
		});
	}
});