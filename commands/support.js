const { Command } = require('easy-djs-commandhandler');
const discord = require('discord.js');
module.exports = new Command({
	name: 'support',
	description:
		'Do you have an issue/suggestion or bot is having problems? you can join the support server and ask',
	requiresBotPermissions: ['EMBED_LINKS'],
}).execute((client, message, args) => {
	let embed = new discord.RichEmbed();
	embed.setColor(client.color);
	embed.setTitle('have an issue? bot not working?');
	embed.setDescription('join the support server\nhttps://discord.gg/GTkjQFr');
	message.channel.send(embed);
});
