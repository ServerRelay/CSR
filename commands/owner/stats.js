const { Command } = require('easy-djs-commandhandler');
const { RichEmbed } = require('discord.js');
const Stats = new Command({
	name: 'stats',
	description: 'get CSR guild stats',
	requires: ['botowner'],
	hideinhelp: true,
});
module.exports = Stats.execute((client, message) => {
	if (!message.guild && client.owners.includes(message.author.id)) {
		let st = 0;
		client.guilds.forEach((sv) => {
			st = st + sv.memberCount;
		});
		let embed = new RichEmbed()
			// @ts-ignore
			.setColor([20, 110, 164, 0.62])
			.setTitle('CSR stats')
			.addField('total servers', message.client.guilds.size, false)
			.addField('total users/members', st, false)
			.addField(
				`total servers connected with CSR: ${client.system.channels
					.public.size + client.system.channels.private.size}`,
				`servers with public channels: ${
					client.system.channels.public.size
				}\nservers with private channels: ${
					client.system.channels.private.size
				}`,
				false
			);
		message.author.send(embed);
	} else {
		let chs = client.system.getChannels(message.guild);
		let connectedGuilds = client.system.getMatchingPrivate(message.guild);
		let embed = new RichEmbed()
			// @ts-ignore
			.setColor([20, 110, 164, 0.62])
			.setTitle('server stats')
			.addField(
				'channels',
				`public: ${chs.public || 'none'}\nprivate: ${chs.private ||
					'none'}`,
				false
			);
		let str = '';
		chs.private
			? (str += `servers connected to ${chs.private}: ${
					connectedGuilds.size
			  }`)
			: '';
		embed.addField('private channel stats', str, false);
		message.channel.send(embed);
	}
});
