define(['jquery', './index-data'], function($, data){
	return {
		init: function(){
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
	}
});



