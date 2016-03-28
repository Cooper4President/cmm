define([
	'jquery', 
	'lodash',
	'./chatInfo'
	], function($, _, chatInfo){

	var duration = 250;
	return function (html){
		var chatId = html.attr('id');
		_.remove(chatInfo.log, function(n){ return n.id === chatId });
		chatInfo.count--;
		if(chatInfo.right.length > 0){
			_.first(chatInfo.right).width(html.width());
			_.pull(chatInfo.center, html);
			chatInfo.center.push(_.first(chatInfo.right));
			_.pull(chatInfo.right, _.first(chatInfo.right));
			var shift = _.union(chatInfo.center, chatInfo.right);
			var lft = 0;
			_.each(shift, function(elm){
				elm.animate({
					left: lft
				},duration);
				lft += elm.width();
			});
			html.remove();
		}else if(chatInfo.left.length > 0){
			_.last(chatInfo.left).width(html.width());
			_.pull(chatInfo.center, html);
			chatInfo.center.unshift(_.last(chatInfo.left));
			_.pull(chatInfo.left, _.last(chatInfo.left));
			var shift = _.union(chatInfo.left, chatInfo.center);
			var lft = -_.sumBy(chatInfo.left, function(n){ return n.width() });
			_.each(shift, function(elm){
				elm.animate({
					left: lft
				},duration);
				lft += elm.width();
			});
			html.remove();
		}else{
			var dist = html.width()/(chatInfo.center.length-1)
			_.pull(chatInfo.center, html);
			var lft = 0;
			_.each(chatInfo.center, function(elm){
				var newWidth = elm.width() + dist;
				elm.animate({
					width: newWidth,
					left: lft,
				}, duration);
				lft += newWidth;
			});
			html.remove();
		}
	}
});