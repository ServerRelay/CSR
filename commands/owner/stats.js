const { Command } = require('easy-djs-commandhandler');
const { RichEmbed } = require('discord.js');
const Stats = new Command({
	name: 'stats',
	description: '(owner) fetch all server names',
	requires: ['botowner'],
	hideinhelp: true,
});
module.exports = Stats.execute((client, message) => {
	let st = 0;
	client.guilds.forEach((sv) => {
		st = st + sv.memberCount;
	});

	//message.author.send(
	//	`\`\`\`md\n${
	//		message.client.guilds.size
	//	}\n <total servers>\n${st}\n <total users/members>\`\`\``
	//);
	let embed = new RichEmbed()
		// @ts-ignore
		.setColor([20, 110, 164, 0.62])
		.setTitle('CSR stats')
		.addField('total servers', message.client.guilds.size, false)
		.addField('total users/members', st, false)
		.addField('public channels', client.system.channels.size)
		.addField('private channels', client.system.privateChannels.size)
		.addField(
			`total servers connected with CSR ${client.system.channels.size +
				client.system.privateChannels.size}`,
			`servers with public channels: ${
				client.system.channels.size
			}\nservers with private channels: ${
				client.system.privateChannels.size
			}`,
			false
		);
	message.author.send(embed);
});
