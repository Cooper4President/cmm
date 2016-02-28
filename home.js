$(document).ready(function(){
	$(".sub").on("click", function(cEvent){
		if($(".cmd").val() != ""){
			$(".chat-container").append("<div> USER: " + $(".cmd").val() + "</div>");
			$(".cmd").val("");
		}
	});
});