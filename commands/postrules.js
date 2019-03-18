const helper = require('../helper');

module.exports = {
	name: 'postrules',
	staff: 'sends the rules on the #irc channel',
	execute(message) {
		if(message.author.id !== '298258003470319616') {
			return;
		}
		const ed = helper.insertRules(message.client);

		message.client.csrchannels.forEach(async (ch) => {
			try{
				await ch.send(ed);
			}
			catch(e) {
				console.log(e.name + '[]' + e.message);
				if(e.message == 'Unknown Channel') {
					message.client.csrchannels.delete(ch.id);
				}
			}
		});


	},
};