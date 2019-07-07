const { Command } = require('easy-djs-commandhandler');
const Staff = new Command({
	name: 'staff',
	description: 'adds or removes staff, flags are `add`, `remove`',
	hideinhelp: true,
	requires: ['botowner'],
});
module.exports = Staff.execute((client, message, args) => {
	let flag = args[0];
	args.splice(0, 1);
	let user = message.mentions.users.first() || client.users.get(args[0]);
	if (!user) {
		return message.channel.send('unknown user');
	}
	client.db.use('staff');
	if (flag == 'add') {
		client.db.insert(user.id, user.tag);
		message.channel.send(`added \`${user.tag}\` as staff`);
	} else if (flag == 'remove') {
		client.db.delete(user.id);
		message.channel.send(`removed \`${user.tag}\` from staff`);
	}
});
