/*
	Defines how to handle chat window closing
*/

define([
	'jquery', 
	'lodash',
	'./chatInfo',
	'./shifter',
	'menu/menuAnimations'
	], function($, _, chatInfo, shifter, menuAnimations){

	//removes window based off current configuration of chat windows
	return function (html){

		//shows menu button if not shown
		menuAnimations.showButton();
		var chatId = html.attr('id');

		//removes window from chat log
		_.remove(chatInfo.log, function(n){ return n.id === chatId });
		chatInfo.count--;

		//pulls in a window that is overflowed off to the right if exists
		if(chatInfo.right.length > 0){ //pulls in a window that is overflowed off to the right if exists

			//reconfigure chat info
			_.first(chatInfo.right).width(html.width());
			_.pull(chatInfo.center, html);
			chatInfo.center.push(_.first(chatInfo.right));
			_.pull(chatInfo.right, _.first(chatInfo.right));
			
			//shifts windows from the right
			var shift = _.union(chatInfo.center, chatInfo.right);
			var lft = 0;
			_.each(shift, function(elm){
				elm.animate({
					left: lft
				},chatInfo.animationDuration);
				lft += elm.width();
			});
		}else if(chatInfo.left.length > 0){ //pulls in a window that is overflowed off to the left if exists

			//reconfigure chat info
			_.last(chatInfo.left).width(html.width());
			_.pull(chatInfo.center, html);
			chatInfo.center.unshift(_.last(chatInfo.left));
			_.pull(chatInfo.left, _.last(chatInfo.left));

			//shifts windows from the left
			var shift = _.union(chatInfo.left, chatInfo.center);
			var lft = -_.sumBy(chatInfo.left, function(n){ return n.width() });
			_.each(shift, function(elm){
				elm.animate({
					left: lft
				},chatInfo.animationDuration);
				lft += elm.width();
			});
		}else{ //scales windows if there is now overflow

			//find distribution
			var dist = html.width()/(chatInfo.center.length-1)

			//reconfigure chat info
			_.pull(chatInfo.center, html);

			//scale each window in view
			var lft = 0;
			_.each(chatInfo.center, function(elm){
				var newWidth = elm.width() + dist;
				elm.animate({
					width: newWidth,
					left: lft,
				}, chatInfo.animationDuration);
				lft += newWidth;
			});
		}
		html.remove(); //removes window from DOM
		if(chatInfo.left.length === 0) shifter.hideRight();
		if(chatInfo.right.length === 0) shifter.hideLeft();

	}
});