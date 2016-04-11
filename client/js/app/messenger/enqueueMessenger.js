/*
	Defines how to handle chat window closing
*/

define([
	'jquery',
	'lodash',
	'./chatInfo',
	'./shifter',
	'menu/menuAnimations'
], function($, _, chatInfo, shifter, menuAnimations) {

	//removes window based off current configuration of chat windows
	return function(html) {

		//shows menu button if not shown
		menuAnimations.showButton();
		var chatId = html.attr('id');

		//removes window from chat log
		_.remove(chatInfo.log, function(n) {
			return n.id === chatId;
		});
		chatInfo.count--;

		var shift, lft;

		//pulls in a window that is overflowed off to the right if exists
		if (chatInfo.right.length > 0) { //pulls in a window that is overflowed off to the right if exists

			//reconfigure chat info
			_.first(chatInfo.right).width(_.remove(chatInfo.center, function(n){return n.is(html);})[0].width());
			chatInfo.center.push(_.remove(chatInfo.right, function(n){return n.is(_.first(chatInfo.right));})[0]);

			//shifts windows from the right
			//shift = _.union(chatInfo.center,[_.first( chatInfo.right)]);
			lft = 0;
			_.each(chatInfo.center, function(elm) {
				elm.animate({
					left: lft
				}, chatInfo.animationDuration);
				lft += elm.width();
			});
		} else if (chatInfo.left.length > 0) { //pulls in a window that is overflowed off to the left if exists

			//reconfigure chat info
			_.last(chatInfo.left).width(_.remove(chatInfo.center, function(n){return n.is(html);})[0].width());
			chatInfo.center.unshift(_.remove(chatInfo.left, function(n){return n.is(_.last(chatInfo.left));})[0]);

			//shifts windows from the left
			//shift = _.union([_.last(chatInfo.left)], chatInfo.center);
			lft = 0;
			_.each(chatInfo.center, function(elm) {
				elm.animate({
					left: lft
				}, chatInfo.animationDuration);
				lft += elm.width();
			});
		} else { //scales windows if there is now overflow

			//find distribution
			var dist = html.width() / (chatInfo.center.length - 1);

			//reconfigure chat info
			_.remove(chatInfo.center, function(elm) {
				return elm.is(html);
			});

			//scale each window in view
			lft = 0;
			_.each(chatInfo.center, function(elm) {
				var newWidth = elm.width() + dist;
				elm.animate({
					width: newWidth,
					left: lft,
				}, chatInfo.animationDuration);
				lft += newWidth;
			});
		}
		html.remove(); //removes window from DOM
		if (chatInfo.left.length === 0) shifter.hideRight();
		if (chatInfo.right.length === 0) shifter.hideLeft();

	};
});