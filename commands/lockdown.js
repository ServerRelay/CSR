const { Command } = require('easy-djs-commandhandler');
const lockdown = new Command({
	name: 'lockdown',
	description: '(staff) locks down the whole irc chat',
});
module.exports = lockdown.execute((client, message) => {
	if (!message.client.staff.has(message.author.id)) {
		return message.channel.send('you dont have access to that command');
	}
	if (message.client.lockdown) {
		message.client.lockdown = false;
		message.channel.send('lockdown ended');
	}
	else {
		message.client.lockdown = true;
		message.channel.send('lockdown has begun');
	}
});
