define(['jquery', './indexSockets'], function($, indexSockets){
	return {
		//changes URL
		storeLoginData: function(){
			var username = $(".username").val();
			var password = $(".password").val();
			if(!/\s+/g.test(username)){ //test for valid user name
				indexSockets.sendUser(username, password);
			}else{
				alert("Username Invalid");
			}
		},
		storeAccountData: function(user, email, pass){
			var user = $('.new-user').val();
			var email = $('.new-email').val(); //create account with email??
			var pass = $('.new-pass').val();
			if(!/\s+/g.test(user)){ //test for valid user name
				indexSockets.createAccount(user, pass);
			}else{
				alert("Username Invalid");
			}		
		}
	}
});
