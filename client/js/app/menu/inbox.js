define(['jquery', 'hbs!templates/request', 'messenger/queueMessenger', 'menu/inbox'], function($, request, queueMessenger, inbox){
	var messages = 0;

	function updateNotifier(){
		console.log(messages);
		if(messages === 1){
			if($('.inbox-button').find('.new-num').length) $('.inbox-button').find('.new-num').html(messages);
			else{
				$('.inbox-button').append(
					'<span class="fa fa-circle fa-stack-1x"></span>\n' + 
					'<span class="new-num fa-stack-1x">1</span>'
				);				
			}
		}else if (messages > 1){
			$('.inbox-button').find('.new-num').html(messages);
		}else{
			$('.inbox-button').find('.fa-circle').remove();
			$('.inbox-button').find('.new-num').remove();
		}
	}


	var api = {
		hideInbox: function(){
			var hide = $(window).height();
			$('.inbox').animate({
				top: -hide
			});
			return api;
		},
		showInbox: function(){
			$('.inbox').animate({
				top: 0
			});
			return api;
		},
		notify: function(user){
			messages++;
			updateNotifier();
			var html = $(request({name: user}));
			$('.inbox').append(html);
			events(html, user);
			return api;
		}
	};
	function events(html, user){
		html.find('.accept').click(function(event){
			queueMessenger([user]);
			html.remove();
			api.hideInbox();
			messages--;
			updateNotifier();
		});
		html.find('.decline').click(function(event){
			html.remove();
			messages--;
			updateNotifier();
		});
	}

	return api;
});