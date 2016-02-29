$(document).ready(function(){
     $(".sub").on("click", function(cEvent){
	 submit();

     });
});

$(document).delegate('input:text','keypress',function(e) {
    if (e.which === 13) {
	e.preventDefault();
	submit();
    };
});

function submit(){
   
	$(".chat-container").append("<div> USER: " + $(".cmd").val() + "</div>");
	$(".cmd").val("");
   
};
