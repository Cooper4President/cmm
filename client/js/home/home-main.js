define(['./login', './animations'],function(login, animation){
	return function(){
		animation.bottom('login-container').center('start');
		login.init();

		$(".login-op").on("click", function(event){
			animation.top('start').center('login-container');
		});
	}
});