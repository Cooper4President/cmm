/*
	Prompts help info for user
*/

define(['jquery', 'hbs!templates/message', '../chatSockets'], function($, message, chatSockets){

	return function(chatId, inp){
		var container = $("#"+chatId).find('.container');

		chatSockets.wolframQuery(inp, function(result){
			console.log(result);
			answer = result[1].subpods[0].text;
			container.append(message({wolfram: answer}));
		});
	};
});