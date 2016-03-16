define(['jquery','lodash','./receiver','jqueryui'], function($, _, receiver){
	return {
		menuOptions: ["add-messenger", "settings", "logout"],
		//delegates show animations for menu options
		showAnimations: function(cl){
			var showMargin = 0;
			var padding = 350;
			var showStyle = {
				left: showMargin,
				paddingRight: padding
			}
			if(Array.isArray(cl)){
				_(cl).each(function(cls){
					$("."+cls).css(showStyle);
				});
			}else{
				$("."+cl).css(showStyle);
			}	
		},

		//delegates hide animations for menu options
		hideAnimations: function(cl){
			var hideMargin = -55;
			var hideStyle = {
				left: hideMargin,
				paddingRight: 0
			}
			if(Array.isArray(cl)){
				_(cl).each(function(cls){
					$("."+cls).css(hideStyle);
				});
			}else{
				$("."+cl).css(hideStyle);	
			}
		},
		//delegates hover animations of menu options
		hoverEvent: function(cl){
			var hoverDist = 5;
			var hoverDist = 18;
			var normDist = 10;

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
			if(Array.isArray(cl)){
				_(cl).each(function(cls){
					$("."+cls).tooltip(toolTipOptions).mouseenter(function(event){
						$(this).css({
							paddingLeft: hoverDist
						})
					}).mouseout(function(event){
						$(this).css({
							paddingLeft: normDist
						});
					}).tooltip("enable");		
				});
			}else{
				$("."+cl).tooltip(toolTipOptions).mouseenter(function(event){
					$(this).css({
						paddingLeft: hoverDist
					})
				}).mouseout(function(event){
					$(this).css({
						paddingLeft: normDist
					}).tooltip("enable");
				});
			}
		},
		//toggles delay on menu options
		toggleDelay: function(){
			var delayOps = _.slice(this.menuOptions, 1);
			_(delayOps).each(function(cls){
				$("."+cls).toggleClass(cls+"-D");
			});
		},
		//shows options menu
		showMenu: function(){
			$(".menu").css({
				top: -$(this).height()
			});
			this.showAnimations(this.menuOptions);

			setTimeout(function(){
				menuEvent.toggleDelay();
			}, 100);
		},

		//hides options menu
		hideMenu: function (){
			if(!$(".settings").hasClass("settings-D")){
				menuEvent.toggleDelay();
			}

			$(".menu").css({
				top: 0
			});
			this.hideAnimations(this.menuOptions);

			receiver.hideReceiverField();
		}
	}	
});

