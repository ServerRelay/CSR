const { Command } = require('easy-djs-commandhandler');
const Colors = new Command({
	name: 'custom-colors',
	description:
		'adds or removes special csr colors, flags are `add`, `remove`',
	hideinhelp: true,
	requires: ['botowner'],
});
module.exports = Colors.execute((client, message, args) => {
	let flag = args[0];
	args.splice(0, 1);
	let user = message.mentions.users.first() || client.users.get(args[0]);
	if (!user) {
		return message.channel.send('unknown user');
	}
	client.db.use('data');
	let colors = client.db.secure('custom_colors', {});
	if (flag == 'add') {
		let struct = {
			tag: user.tag,
			color: [parseInt(args[1]), parseInt(args[2]), parseInt(args[3])],
		};
		colors[user.id] = struct;
		client.db.insert('custom_colors', colors);
		message.channel.send(`added \`${user.tag}\`'s custom color ${struct.color}`);
	} else if (flag == 'remove') {
		delete colors[user.id];
		client.db.insert('custom_colors', colors);
		message.channel.send(`removed \`${user.tag}\`'s custom color`);
	}
});
