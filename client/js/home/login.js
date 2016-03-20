define(['jquery', './index-data', './animations'], function($, data, animation){
	return function(){
		//switches to sign up screen
		$('.sign-up-re').on('click', function(event){
			animation.bottom('login').center('sign-up');
		});		
		//submit button event
		$(".log").on("click",function(){
			console.log("someshit");
			data.storeLoginData();
		});

		//delegate for enter key
		$(".username, .password").keydown(function(e) {
		    if (e.which === 13) {
				e.preventDefault();
				data.storeLoginData();
		    }
		});
	}
});



