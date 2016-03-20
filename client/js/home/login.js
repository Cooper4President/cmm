define(['jquery', './index-data'], function($, data){
	return {
		init: function(){
			//submit button event
			$(".login").on("click",function(){
				data.storeLoginData();
			});

			//delegate for enter key
			$(".username, .password").keydown(function(e) {
			    if (e.which === 13) {
					e.preventDefault();
					data.storeLoginData();
			    };
			});
		}
	}
});



