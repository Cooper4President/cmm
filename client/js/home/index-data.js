define(['jquery', './index-sockets'], function($, socket){
	return {
		//changes URL
		storeLoginData: function(){
			var username = $(".username").val();
			var password = $(".password").val();
			if(!/\s+/g.test(username)){ //test for valid user name
				socket.sendUser(username, password);
			}else{
				alert("Username Invalid");
			}
		},
		storeAccountData: function(user, email, pass){
			var user = $('.new-user').val();
			var email = $('.new-email').val(); //create account with email??
			var pass = $('.new-pass').val();
			if(!/\s+/g.test(user)){ //test for valid user name
				socket.createAccount(user, pass);
			}else{
				alert("Username Invalid");
			}		
		}
	}
});
