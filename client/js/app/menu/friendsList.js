define([
	'jquery', 
	'misc/user', 
	'hbs!templates/friendList', 
	'messenger/queueMessenger',
	'./menuAnimations',

	//jquery pluins
	'jqueryui'
	], function($, user, friendList, queueMessenger, menuAnimations){
	var api = {

		hideFriendsList: function(){
			var h = $(window).height();
			$('.friends').animate({
				top: -h
			});
		},

		showFriendsList: function(){
			$('.friends').animate({
				top: 0
			});
		},

		init: function(){
            var toolTipOptions = {
                track: true,
                show: {
                    delay: 750,
                    effect: "fade"
                },
                hide: {
                    effect: "none"
                }
            };

			var _this = this;
			var search = $('.friends').find('.search');
			$('.friends').find('.add-friend-button').tooltip(toolTipOptions).click(function(event){
				$('.friends').find('.list').prepend(friendList({friends: search.val()}));
				search.val(null).trigger('change');
				$('.friends').find('.chat-start').unbind('click').click(function(event){
					var elm = $(this).closest('.item').find('.name').html();
					queueMessenger([elm]);
					_this.hideFriendsList();
				});
			});
		}
	};

	return api;
});