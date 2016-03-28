define([
	'jquery',

	//jquery plug in
	'jqueryui'
	], function($){
	return {
		showAnimation: function(cl){
			var padding = 350;
			var showStyle = {
				left: 0,
				paddingRight: padding
			}
			if(Array.isArray(cl)){
				var dl = 0;
				_(cl).each(function(cls){
					$("."+cls).delay(dl).animate(showStyle, 250);
					dl += 250;
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
				var dl = 0;
				_(cl).each(function(cls){
					$("."+cls).delay(dl).animate(hideStyle, 250);
					dl += 250;
				});
			}else{
				$("."+cl).css(hideStyle);	
			}
		}
	}
});