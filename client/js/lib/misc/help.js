define(['jquery', 'messenger/chat'], function($, chat){
	return{
		//help text handler
		getHelp: function(chatId){
			//ajax call gets help info from help.txt
			$.ajax({
				url: 'help.txt',
				dataType: 'text',
				success: function(data){
					data = data.replace(/\n/g, '<br />');
					chat.updateChat(chatId, data);
				},
				error: function(data){
					console.log("Error with help");
				}
			});
		}
	}
});	
