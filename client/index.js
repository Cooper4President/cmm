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
	$(location).attr('href',"http://127.0.0.1:8000/"+ext);
}