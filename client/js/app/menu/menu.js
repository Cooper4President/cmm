define([
	'jquery', 
	'./menuAnimations', 

	//jquery plug ins
	'jqueryui'
	], function($, menuAnimations){
	return function(){
		var toolTipOptions = {
			track: true,
			show: {
				delay: 750,
				effect: "fade"
			},
			hide: {
				effect: "none"
			}
		}

		$('.menu-item').tooltip(toolTipOptions);
		//delegates menu option enter
		$(".menu").on("click", function(event){
			menuAnimations.showMenu();
		});

		//delegates menu option escape
		$(".messenger-container").mouseenter(function(event){
			menuAnimations.hideMenu();
		});		
	}
	function initAddMessenger(){
		$(".add-messenger").on("click",function(clickEvent){
			$(this).tooltip("disable").unbind("hover").css({
				paddingLeft: 10
	    	});
			menuAnimations.showReceiverField();
		});
	}
});