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
		}
	}
});
