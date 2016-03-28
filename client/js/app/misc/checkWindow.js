define(['jquery', 'lodash', 'messenger/chatInfo'], function($, _, chatInfo){
	return function(){
		$(window).on('resize', function(event){
			if(chatInfo.center.length > 0){
				var cont = _.sumBy(chatInfo.center, function(n){ return n.width(); });
				var scale = $(window).width()/cont;
				var shift = _.union(chatInfo.center, chatInfo.right);
				var lft = 0;
				_.each(shift, function(elm){
					var newWidth = elm.width()*scale;
					elm.css({
						width: newWidth,
						left: lft
					});
					lft += newWidth;
				});
			}
		});
	}
});