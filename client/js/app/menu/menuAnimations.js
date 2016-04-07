/*
	Defines animations for menu events
*/

define([
	'jquery',

	//jquery plug in
	'jqueryui'
	], function($){
	var D = 350;
	var api = {
		//shows button to open menu
		showButton: function(){	
			$(".menu").animate({
				top: 0
			}, D);
			return api;
		},

		//hides button for menu
		hideButton: function(){	
			var tp = -$('.menu').height() - 5;	
			$(".menu").animate({
				top: tp
			}), D;
			return api;
		},

		// shows menu options
		showMenu: function(){
			$('.backdrop').css('display', 'block');
			//all the fun for blurring chat boxes
			$('.messenger-container').css({
			   'filter'         : 'blur(2px)',
			   '-webkit-filter' : 'blur(2px)',
			   '-moz-filter'    : 'blur(2px)',
			   '-o-filter'      : 'blur(2px)',
			   '-ms-filter'     : 'blur(2px)'			
			});

			//loops through each item and displays with a delay
			var dl = 0
			$('.menu-item').each(function(){
				var bt = 0.5*$(window).height() - 0.5*$(this).height();
				$(this).delay(dl).animate({
					bottom: bt
				}, D);
				dl += D;
			});

			return api;
		},

		//delegates hide animations for menu options
		hideMenu: function(){
			//similar to show menu but opposite direction
			$('.backdrop').css('display', 'none');
			$('.messenger-container').css({
			   'filter'         : 'blur(0px)',
			   '-webkit-filter' : 'blur(0px)',
			   '-moz-filter'    : 'blur(0px)',
			   '-o-filter'      : 'blur(0px)',
			   '-ms-filter'     : 'blur(0px)'			
			});
			var dl = 0
			$('.menu-item').each(function(){
				var bt = -$(this).height()-5;
				$(this).delay(dl).animate({
					bottom: bt
				}, D);
				dl += D;
			});
			return api;
		}
	}

	return api;
});