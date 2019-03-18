const helper = require('../helper');
module.exports = {
	name: 'code',
	alias:['rules'],
	description: 'sends the rules to using the #irc channel',
	execute(message) {
		message.channel.send(helper.insertRules(message.client));
	},
};