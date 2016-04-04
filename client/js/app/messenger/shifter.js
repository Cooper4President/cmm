/*
	Defines how shifters work for shifting between overflowed windows
*/

define(['jquery', 'lodash', './chatInfo'], function($, _, chatInfo){

	return {

		//hides or shows shifters
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

		//initializes shifter functions
		init: function(){
			var curr = this;

			//delegate for shifting to the left
			$('.shift-left').on('click', function(event){
				//configure chat windows to account of shift
				var pop = _.first(chatInfo.center);
				var push = _.first(chatInfo.right);
				_.first(chatInfo.right).width(pop.width());
				_.pull(chatInfo.center, pop);
				_.pull(chatInfo.right, push);
				chatInfo.center.push(push);
				chatInfo.left.push(pop);

				//shift needed windows to the left
				var shift = _.union([_.last(chatInfo.left)], chatInfo.center);
				var lft = -_.last(chatInfo.left).width();
				_.each(shift, function(elm){
					elm.animate({
						left: lft
					}, chatInfo.animationDuration);
					lft += elm.width();
				});

				//hide or show shifters according to configuration
				if(chatInfo.right.length === 0) curr.hideLeft();
				if(chatInfo.left.length > 0) curr.showRight();				
			});

			//delegate for shifting to the right
			$('.shift-right').on('click', function(event){
				//configure chat windows to account of shift
				var pop = _.last(chatInfo.center);
				var push = _.last(chatInfo.left);
				push.width(pop.width());
				_.pull(chatInfo.center, pop);
				_.pull(chatInfo.left, push);
				chatInfo.center.unshift(push);
				chatInfo.right.unshift(pop);

				//shift needed windows to the right
				var shift = _.union(chatInfo.center, [_.first(chatInfo.right)]);
				var lft = 0;
				_.each(shift, function(elm){
					elm.animate({
						left: lft
					}, chatInfo.animationDuration);
					lft += elm.width();
				});

				//hide or show shifters according to configuration
				if(chatInfo.left.length === 0) curr.hideRight();
				if(chatInfo.right.length > 0) curr.showLeft();				
			});
		}
	}
});