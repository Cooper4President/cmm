$(document).ready(function(){
	$(".sub").on("click", function(cEvent){
		$(".chat-container").append("<div> USER: " + $(".cmd").val() + "</div>");	
	});
});