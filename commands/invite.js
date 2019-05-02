const Discord = require('discord.js');
const { Command } = require('easy-djs-commandhandler');
const invite = new Command({
	name: 'invite',
	description: 'sends a link to invite the bot',
	requiresBotPermissions: ['EMBED_LINKS'],
});
module.exports = invite.execute((client, message) => {
	const ed = new Discord.RichEmbed()
		.setColor([0, 255, 40])
		.setFooter('CSR', message.client.user.avatarURL);
	message.client
		.generateInvite(['ADMINISTRATOR'])
		.then(link => {
			ed.setDescription(`thanks for choosing to invite the bot.\n invite:
        ${link}`);
			message.channel.send(ed);
		})
		.catch(console.error);
});
