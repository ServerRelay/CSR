module.exports = {
	name: 'support',
	description: 'sends a invite link to join the official server',
	execute(message) {
		message.author.send('join the support server https://discord.gg/mkjbFXF');
	},
};