define(['jquery', './menu-events', './receiver', 'jqueryui'], function($, menuEvent){
	return{
		//classes of menu options (MUST BE ORDERED LIST OF CURRENT MENU OPTION LAY OUT)
		initMenu: function(){
			var cur = this;
			//initializes sortable chat windows
			//$('.messenger-container').sortable({axis:'x'});

		    //delgate for menu hover
		    $(".menu").hover(function(event){
		    	$(this).toggleClass("menu-unhover");
		    });

			//delegates menu option enter
			$(".menu").on("click", function(event){
				menuEvent.showMenu();
			});

			//delegates menu option escape
			$(".messenger-container").mouseenter(function(event){
				menuEvent.hideMenu();
			});		
		},
		initAddMessenger: function(){
		    $(".add-messenger").on("click",function(clickEvent){
		    	$(this).tooltip("disable").unbind("mouseenter").css({
		    		paddingLeft: 10
		    	});
		    	menuEvent.showReceiverField();
			});
		}
	}
});