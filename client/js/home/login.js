define(['jquery', './indexData', './animations'], function($, indexData, animations){
	return function(){
		//switches to sign up screen
		$('.sign-up-re').on('click', function(event){
			animations.bottom('login').center('sign-up');
		});		
		//submit button event
		$(".log").on("click",function(){
			indexData.storeLoginData();
		});

		//delegate for enter key
		$(".username, .password").keydown(function(e) {
		    if (e.which === 13) {
				e.preventDefault();
				indexData.storeLoginData();
		    }
		});
	};
});



