//login main
$(document).ready(function(){
	$(".login").on("click",function(){
		changeURL("chat.html");
	});
});

//delegate for enter key
$(document).delegate('body','keypress',function(e) {
    if (e.which === 13) {
		e.preventDefault();
		changeURL("chat.html");
    };
});

//changes URL
function changeURL(ext){
	var username = $(".username").val();
	console.log(username);
	if(!/\s+/g.test(username)){ //test for valid user name
		setCookie("login", username, 1);
		$(location).attr('href',"http://localhost:3000/"+ext);
	}else{
		alert("Username Invalid");
	}
}


//cookie function
function setCookie(c_name,c_value,exdays) {
   var exdate=new Date();
   exdate.setDate(exdate.getDate() + exdays);
   document.cookie=encodeURIComponent(c_name) 
     + "=" + encodeURIComponent(c_value)
     + (!exdays ? "" : "; expires="+exdate.toUTCString());
     ;
}