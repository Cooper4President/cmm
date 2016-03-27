define([
	'jquery', 
	'lodash', 
	'./chatInfo',
	'hbs!templates/messenger',
	'./sort',
	'./resize'
	], function($, _, chatInfo, messenger, sort, resize){

	//delay for animations
	var delay = 250;

	function scaleToAdd(html){
		$('.messenger-container').prepend(html);
		if(chatInfo.center.length > 0){
			var
				shrink = $(window).width() - html.width(),
				scale = shrink/$(window).width(),
				minW = parseInt(html.css('minWidth')),
				widths = _.map(chatInfo.center, function(n){ return n.width()*scale }),
				minCount = 0,
				diff = 0,
				lft = html.width();
			_.each(widths, function(ent, ind){
				if(ent <= minW){
					diff += minW - ent;
					widths[ind] = minW;
					minCount++;
				}
			});
			var dist = diff/(widths.length - minCount);
			if(dist){
				_.each(widths, function(ent, ind){
					if(ent !== minW) widths[ind] -= dist;
				});
			}
			_.each(chatInfo.center, function(elm, ind){
				elm.animate({
					width: widths[ind],
					left: lft
				}, delay);
				lft += widths[ind];
			});
		}
		html.animate({left: 0}, delay);
		chatInfo.center.unshift(html);
	}

	function shiftToAdd(html){
		html.width(_.last(chatInfo.center).width());
		chatInfo.center[0].before(html);
		chatInfo.right.unshift(_.last(chatInfo.center));
		_.pull(chatInfo.center, _.last(chatInfo.center));
		chatInfo.center.unshift(html);
		var shifting = _.union(chatInfo.center, chatInfo.right);
		var lft = 0;
		_.each(shifting, function(elm){
			elm.animate({
				left: lft
			},delay);
			lft += elm.width();
		});
	}

	return function(rec){
		if(rec){
			var 
				chatId = "chat-" + ++chatInfo.count,
				format = _.join(rec, ', '),
				context = {id: chatId, formatted: format},
				html = $(messenger(context)).css({
					'width': chatInfo.defaultWidth(),
					'left': -chatInfo.defaultWidth()
				}).data("receivers", rec);
			if(chatInfo.count > chatInfo.chatsPerWindow) shiftToAdd(html);
			else scaleToAdd(html);

			sort(chatId);
			resize(chatId);

			chatInfo.updateChatLog(chatId);

			return chatId;

		}else{
			alert('a username was invalid');
			return null;
		}
	}
});