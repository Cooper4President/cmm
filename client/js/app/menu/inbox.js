define(['jquery'], function($){
	var messages = 0;

	function updateNotifier(){
		messages++;
		if(messages < 2){
			$('.inbox-button').append(
				'<span class="fa fa-circle fa-stack-1x"></span>\n' + 
				'<span class="new-num fa-stack-1x">1</span>'
			);
		}else{
			$('.inbox-button').find('.new-num').html(messages);
		}
	}

	var api = {
		notify: function(){
			updateNotifier();
		}
	};

	return api;
});