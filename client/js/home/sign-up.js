define(['jquery', './animations', './index-data'], function($, animation, data){
	return function(){
		//switches to login window
		$('.login-re').on('click', function(event){
			animation.top('sign-up').center('login');
		});

		//enterkey delegate
		$('.new-user, .new-email, .new-pass').keydown(function(event){
			if(event.which === 13){
				data.storeAccountData();
			}
		});

		//sign up button delegate
		$('.sign').on('click', function(event){
			data.storeAccountData();
		});
	}
});