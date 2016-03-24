define([
	'jquery',
	'lodash',
	'./menu-animations',
	'./menu-info',

	//jquery plug ins
	'jqueryui'
	], function($, _, menuAnimations, menuInfo){
	return {

		//toggles delay on menu options
		toggleDelay: function(){
			var delayOps = _.slice(menuInfo.options, 1);
			_(delayOps).each(function(cls){
				$("."+cls).toggleClass(cls+"-D");
			});
		},

		//shows options menu
		showMenu: function(){
			$(".menu").css({
				top: -$(".menu").height()-5
			});
			menuAnimations.showAnimation(menuInfo.options);

			curr = this
			setTimeout(function(){
				curr.toggleDelay();
			}, 100);
		},

		//hides options menu
		hideMenu: function (){
			if(!$(".settings").hasClass("settings-D")){
				this.toggleDelay();
			}
			if(!$('.menu').hasClass('menu-unhover')) $('.menu').toggleClass("menu-unhover");

			$(".menu").css({
				top: 0
			});
			menuAnimations.hideAnimation(menuInfo.options);

			this.hideReceiverField();
		},
		//hides receiver field
		hideReceiverField: function(){
			//give event delegate back to add messenger button
		 	menuAnimations.hoverAnimation("add-messenger");

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
		},

		//start the hover animations for all options
		hoverStart: function(){
			menuAnimations.hoverAnimation(menuInfo.options);
		}
	}	
});

