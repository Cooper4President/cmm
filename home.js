//main function
$(document).ready(function(){
     $(".sub").on("click", function(cEvent){
     	var cmdVal = $(".cmd").val();
	 	if(cmdVal != ""){submit()}

     });
});

//Enter key functionality for sumbitting messages
$(document).delegate('input:text','keypress',function(e) {
    if (e.which === 13) {
	e.preventDefault();
	submit();
    };
});

//client side submit function
function submit(){
   
	$(".chat-container").append("<div> USER: " + $(".cmd").val() + "</div>");
	$(".cmd").val("");
   
};
