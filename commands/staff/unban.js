const { Command } = require('easy-djs-commandhandler');
const unban = new Command({ name: 'unban', hideinhelp: true });
module.exports = unban.execute(async (client, message, args) => {
	if (!message.client.staff.has(message.author.id)) {
		message.channel.send('no permission');
		return;
	}
	const banee =
		message.mentions.users.first() ||
		message.client.users.get(args[0]) ||
		message.client.users.find((x) => x.tag == args.join(' ')) ||
		message.client.users.find((x) => x.username == args.join(' '));
	if (!banee) {
		return;
	}
	client.system.bansManager.delete(banee.id);
	message.channel.send('removed from DB');
});
