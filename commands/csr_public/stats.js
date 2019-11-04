const { Command } = require('easy-djs-commandhandler');
const { RichEmbed } = require('discord.js');
const Stats = new Command({
	name: 'stats',
	description: 'get CSR guild stats',
	requiresBotPermissions: ['EMBED_LINKS'],
});
module.exports = Stats.execute((client, message) => {
	if (!message.guild) {
		if (!client.owners.includes(message.author.id)) return;
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
				`servers with public channels: ${client.system.channels.public.size}\nservers with private channels: ${client.system.channels.private.size}`,
				false
			);
		message.author.send(embed);
	} else {
		let chs = client.system.getChannels(message.guild);
		let connectedGuilds = client.system.getMatchingPrivate(message.guild);
		let embed = new RichEmbed()
			.setAuthor('server stats', message.guild.iconURL, '')
			// @ts-ignore
			.setColor([20, 110, 164, 0.62])

			.addField(
				'channels',
				`public: ${chs.public || 'none'}\nprivate: ${chs.private ||
					'none'}`,
				false
			);
		if (!chs.private) return message.channel.send(embed);
		let str = `servers connected to ${chs.private}: ${
			connectedGuilds.size
		}\n${
			message.author.id == message.guild.owner.id
				? `private passcode: **${chs.private.passcode}**`
				: ''
		}`;

		embed.addField('private channel stats', str, false);
		message.channel.send(embed);
	}
});
