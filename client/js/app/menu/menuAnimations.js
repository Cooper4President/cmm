define([
	'jquery',

	//jquery plug in
	'jqueryui'
	], function($){
	var D = 350;
	return {
		showMenu: function(){
			//$('.backdrop').css('display', 'block');
			$('.messenger-container').css({
			   'filter'         : 'blur(2px)',
			   '-webkit-filter' : 'blur(2px)',
			   '-moz-filter'    : 'blur(2px)',
			   '-o-filter'      : 'blur(2px)',
			   '-ms-filter'     : 'blur(2px)'			
			});

			$(".menu").animate({
				top: '-100%'
			});
			//var padding = D;
			var dl = 0
			$('.menu-item').each(function(){
				var bt = 0.5*$(window).height() - 0.5*$(this).height();
				$(this).delay(dl).animate({
					bottom: bt
				}, D);
				dl += D;
			});
		},

		//delegates hide animations for menu options
		hideMenu: function(mnu){
			//$('.backdrop').css('display', 'none');
			$('.messenger-container').css({
			   'filter'         : 'blur(0px)',
			   '-webkit-filter' : 'blur(0px)',
			   '-moz-filter'    : 'blur(0px)',
			   '-o-filter'      : 'blur(0px)',
			   '-ms-filter'     : 'blur(0px)'			
			});
			if(mnu){
				$(".menu").delay(D).animate({
					top: 0
				}, D);
			}
			var dl = 0
			$('.menu-item').each(function(){
				var bt = -$(this).height()-5;
				$(this).delay(dl).animate({
					bottom: bt
				}, D);
				dl += D;
			});
		},
		//hides receiver field
		hideReceiver: function(){
			//give event delegate back to add messenger button
		 	$('.menu-item').tooltip("enable");
		 	$(".add-messenger").hover(function(event){ $(this).css('padding-left', 15) }, function(event){ $(this).css('padding-left', 10) });

			$(".receiver").css({
				borderColor: "transparent",
				width: 0,
				height: 36,
				zIndex: 0,
				borderWidth: 0
			}).val("");
		},

		//shows receiver field
		showReceiver: function(){
		 	$(".receiver").css({
		 		width: 195,
		 		borderColor: "black",
		 		height: 36,
		 		zIndex: 5,
		 		borderWidth: 3
		 	}).focus();
		},
		showFriends: function(){
			$('.friends-list').animate({
				top: 0
			},D);
		},
		hideFriends: function(){
			$('.friends-list').animate({
				top: '-100%'
			},D);
		}
	}
});