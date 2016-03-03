//login main
$(document).ready(function(){
	//submit button event
	$(".login").on("click",function(){
		storeUserData();
	});
});

//delegate for enter key
$(document).delegate('body','keypress',function(e) {
    if (e.which === 13) {
		e.preventDefault();
		storeUserData();
    };
});

//changes URL
function storeUserData(){
	var username = $(".username").val();
	var password = $(".password").val();
	if(!/\s+/g.test(username)){ //test for valid user name
		sendUser(username, password);
	}else{
		alert("Username Invalid");
	}
}


