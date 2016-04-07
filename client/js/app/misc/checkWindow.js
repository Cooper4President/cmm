/*
	Checks window to make sure elements are aligned properly
*/

define(['jquery', 'lodash', 'messenger/chatInfo', 'menu/menu'], function($, _, chatInfo, menu){
	return function(){
		$(window).on('resize', function(event){
			//sets up menu options when window changes
			menu.setUp();

			//aligns viewable chat windows to the window size
			if(chatInfo.center.length > 0){
				var cont = _.sumBy(chatInfo.center, function(n){ return n.width(); });
				var scale = $('body').width()/cont;

				//scales viewable windows to fit screen
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