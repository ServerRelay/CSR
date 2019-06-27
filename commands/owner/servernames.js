const { Command } = require('easy-djs-commandhandler');
const servernames = new Command({
	name: 'servernames',
	description: '(owner) fetch all server names',
	requires: ['botowner'],
	aliases: ['snames'],
	hideinhelp:true,
});
module.exports = servernames.execute((client, message) => {
	let text = '';
	if (message.author.id != '298258003470319616') {
		return;
	}

	message.client.guilds.forEach(guild => {
		text += guild.name + '\n';
	});
	message.author.send(text, { split: true });
});
