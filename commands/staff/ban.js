
const { Command } = require('easy-djs-commandhandler');
const ban = new Command({
	name: 'ban',
	description:
		'(staff only) bans an user from using fundamental CSR functions',
	hideinhelp: true,
});
module.exports = ban.execute((client, message, args) => {
	
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
		message.channel.send('not found');
		return;
	}
	client.system.ban(banee);
	message.channel.send(
		`${message.client.users.get(banee.id).username} has been banned`
	);
});
