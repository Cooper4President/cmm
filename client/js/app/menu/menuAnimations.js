define([
	'jquery',

	//jquery plug in
	'jqueryui'
	], function($){
	return {
		showMenu: function(){
			$('.menu-area').css('display', 'block');
			$(".menu").css({
				top: -$(".menu").height()-5
			});
			var padding = 350;
			var showStyle = {
				left: 0,
				paddingRight: padding
			}
			var dl = 0
			$('.menu-item').each(function(elm){
				$(this).delay(dl).animate(showStyle, 250);
				dl += 250
			});
		},

		//delegates hide animations for menu options
		hideMenu: function(){
			$('.menu-area').css('display', 'none');
			$(".menu").delay(250).animate({
				top: 0
			}, 250);
			var hideMargin = -55;
			var hideStyle = {
				left: hideMargin,
				paddingRight: 0
			}
			var dl = 0
			$('.menu-item').each(function(elm){
				$(this).delay(dl).animate(hideStyle, 250);
				dl += 250
			});
		},
		//hides receiver field
		hideReceiverField: function(){
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
		showReceiverField: function(){
		 	$(".receiver").css({
		 		width: 195,
		 		borderColor: "black",
		 		height: 36,
		 		zIndex: 5,
		 		borderWidth: 3
		 	}).focus();
		}
	}
});