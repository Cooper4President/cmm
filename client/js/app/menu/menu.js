define([
	'jquery', 
	'./menuAnimations', 

	//jquery plug ins
	'jqueryui'
	], function($, menuAnimations){

	return {
		setUp: function(){
			var step = $(window).width()/($('.menu-item').length+1);
			var lft = step;
			$('.menu-item').each(function(){
				$(this).css({
					left: lft - $(this).width()
				});
				lft += step;
			});
		},

		init: function(){
			this.setUp();
			menuAnimations.showMenu();
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
				menuAnimations.hideButton();
			});
			$('body').keydown(function(event){
				if(event.keyCode === 27) {
					menuAnimations.hideMenu();
					menuAnimations.showButton();
				}
			});
		}
	}
});