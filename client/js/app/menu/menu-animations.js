define([
	'jquery',

	//jquery plug in
	'jqueryui'
	], function($){
	return {
		showAnimation: function(cl){
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
		hideAnimation: function(cl){
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
		hoverAnimation: function(cl){
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
		}	
	}
});