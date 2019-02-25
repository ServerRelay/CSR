module.exports = {
	name: 'support',
	description: 'sends a invite link to join teh official server',
	execute(message) {
		message.author.send('join the support server https://discord.gg/mkjbFXF');
	},
};