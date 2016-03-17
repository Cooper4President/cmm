define(['jquery'], function($){
	function append(chatId,data){
		$("#"+chatId).find('chat-container').append("<div>"+data+ "</div>");
	}

	return{
		//help text handler
		getHelp: function(chatId){
			//ajax call gets help info from help.txt
			$.ajax({
				context: this,
				url: 'help.txt',
				dataType: 'text',
				success: function(data){
					console.log('sent data');
					data = data.replace(/\n/g, '<br />');
					append(chatId, data);
				},
				error: function(data){
					console.log("Error with help");
				}
			});
		}
	}
});	
