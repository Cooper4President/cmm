define([
	'jquery',
	'lodash',
	'./menuAnimations',
	'./menuInfo',

	//jquery plug-ins
	'jqueryui'
	], function($, _, menuAnimations, menuInfo){
	return {

		//shows options menu
		showMenu: function(){
			$(".menu").css({
				top: -$(".menu").height()-5
			});
			menuAnimations.showAnimation(menuInfo.options);
		},

		//hides options menu
		hideMenu: function (){
			$(".menu").delay(250).animate({
				top: 0
			}, 250);
			menuAnimations.hideAnimation(menuInfo.options);

			this.hideReceiverField();
		},
		//hides receiver field
		hideReceiverField: function(){
			//give event delegate back to add messenger button
		 	//menuAnimations.hoverAnimation("add-messenger");
		 	$('.menu-item').tooltip("enable");
		 	$(".add-messenger").hover(function(event){$(this).css('padding-left', 15)}, function(event){$(this).css('padding-left', 10)});

			$(".receiver").css({
				borderColor: "transparent",
				width: 0,
				height: 36,
				zIndex: 0,
				borderWidth: 0
			}).val("");
		},

		//shows receiver field
		showReceiverField: function(){
		 	$(".receiver").css({
		 		width: 195,
		 		borderColor: "black",
		 		height: 36,
		 		zIndex: 1,
		 		borderWidth: 3
		 	}).focus();
		}
	}	
});

