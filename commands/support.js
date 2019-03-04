module.exports = {
	name: 'support',
	description: 'sends a invite link to join the official server',
	execute(message) {
		if(message.client.banlist.findIndex(x=>x === message.author.id) != -1) {
			return message.channel.send('not allowed to have that');
		}
		message.author.send('join the support server https://discord.gg/mkjbFXF');
	},
};