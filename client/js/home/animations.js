define(['jquery'], function($){
	var api = {
		center: function(el){
			var elm = $('.'+el);
			var ldist = 0.5*$(window).width() - 0.5*elm.width();
			var tdist = 0.5*$(window).height() - 0.5*elm.height();
			elm.css({
				left: ldist,
				top: tdist
			});
			$(window).on("resize", function(event){
				var ldist = 0.5*$(window).width() - 0.5*elm.width();
				var tdist = 0.5*$(window).height() - 0.5*elm.height();
				elm.css({
					left: ldist,
					top: tdist
				});				
			});
			return api
		},
		top: function(el){
			var elm = $('.'+el);
			var ldist = 0.5*$(window).width() - 0.5*elm.width();
			var tdist = -elm.height()-5;
			elm.css({
				left: ldist,
				top: tdist
			});
			$(window).on("resize", function(event){
				var ldist = 0.5*$(window).width() - 0.5*elm.width();
				var tdist = -elm.height()-5;
				elm.css({
					left: ldist,
					top: tdist
				});			
			});
			return api
		},
		bottom: function(el){
			var elm = $('.'+el);
			var ldist = 0.5*$(window).width() - 0.5*elm.width();
			var tdist = $(window).height();
			elm.css({
				left: ldist,
				top: tdist
			});
			$(window).on("resize", function(event){
				var ldist = 0.5*$(window).width() - 0.5*elm.width();
				var tdist = $(window).height();
				elm.css({
					left: ldist,
					top: tdist
				});				
			});			
			return api
		}	
	}
	return api
});