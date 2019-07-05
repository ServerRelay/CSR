const { Command } = require('easy-djs-commandhandler');
const servers = new Command({
	name: 'servers',
	description: 'sends the amount of servers',
});
module.exports = servers.execute((client, message) => {
	let text = '';
	message.client.guilds.forEach(guild => {
		text += guild.name + '\n';
	});
	message.author.send(text, { split: true });
	
});
