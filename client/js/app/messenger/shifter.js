define(['jquery', 'lodash', './chatInfo'], function($, _, chatInfo){

	//var chatInfo.animationDuration ;

	return {
		showLeft: function(){
			$('.shift-left').css('right', 0);
		},
		showRight: function(){
			$('.shift-right').css('left', 0);
		},
		hideLeft: function(){
			$('.shift-left').css('right', '-100%');
		},
		hideRight: function(){
			$('.shift-right').css('left', '-100%');
		},
		init: function(){
			var curr = this;
			$('.shift-left').on('click', function(event){
				var pop = _.first(chatInfo.center);
				var push = _.first(chatInfo.right);
				_.first(chatInfo.right).width(pop.width());
				_.pull(chatInfo.center, pop);
				_.pull(chatInfo.right, push);
				chatInfo.center.push(push);
				chatInfo.left.push(pop);
				var shift = _.union([_.last(chatInfo.left)], chatInfo.center);
				var lft = -_.last(chatInfo.left).width();
				_.each(shift, function(elm){
					elm.animate({
						left: lft
					}, chatInfo.animationDuration);
					lft += elm.width();
				});
				if(chatInfo.right.length === 0) curr.hideLeft();
				if(chatInfo.left.length > 0) curr.showRight();				
			});
			$('.shift-right').on('click', function(event){
				var pop = _.last(chatInfo.center);
				var push = _.last(chatInfo.left);
				push.width(pop.width());
				_.pull(chatInfo.center, pop);
				_.pull(chatInfo.left, push);
				chatInfo.center.unshift(push);
				chatInfo.right.unshift(pop);
				var shift = _.union(chatInfo.center, [_.first(chatInfo.right)]);
				var lft = 0;
				_.each(shift, function(elm){
					elm.animate({
						left: lft
					}, chatInfo.animationDuration);
					lft += elm.width();
				});
				if(chatInfo.left.length === 0) curr.hideRight();
				if(chatInfo.right.length > 0) curr.showLeft();				
			});
		}
	}
});