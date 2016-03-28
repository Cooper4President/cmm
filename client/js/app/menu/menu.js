define([
	'jquery', 
	'./menuEvents', 

	//jquery plug ins
	'jqueryui'
	], function($, menuEvents){
	return{
		//classes of menu options (MUST BE ORDERED LIST OF CURRENT MENU OPTION LAY OUT)
		initMenu: function(){
			var cur = this;
			//initializes sortable chat windows
			//$('.messenger-container').sortable({axis:'x'});
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
				menuEvents.showMenu();
			});

			//delegates menu option escape
			$(".messenger-container").mouseenter(function(event){
				menuEvents.hideMenu();
			});		
		},
		initAddMessenger: function(){
		    $(".add-messenger").on("click",function(clickEvent){
		    	$(this).tooltip("disable").unbind("mouseenter").css({
		    		paddingLeft: 10
		    	});
		    	menuEvents.showReceiverField();
			});
		}
	}
});