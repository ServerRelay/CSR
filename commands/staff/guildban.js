const csr = require('../../banfuncs.js');
const { Command } = require('easy-djs-commandhandler');
const guildban = new Command({
	name: 'guildban',
	description: '(staff) bans a whole guild from using CSR services',
	hideinhelp: true,
});
module.exports = guildban.execute((client, message, args) => {
	if (!args[0]) {
		return message.channel.send(
			'please specify a server, we dont want accidental bans'
		);
	}
	if (!message.client.staff.has(message.author.id)) {
		message.channel.send('no permission');
		return;
	}
	const guild =
		message.client.guilds.get(args[0]) ||
		message.client.guilds.find(
			(x) =>
				x.name.toLowerCase().indexOf(args.join(' ').toLowerCase()) != -1
		);
	if (!guild) {
		return message.channel.send('not found');
	}
	let o = 0;
	for (const i of guild.members.array()) {
		if (i.bot) {
			continue;
		}
		o += 1;
		csr.CSRBan(message.client, i);
	}
	message.channel.send(`${guild.name}:banned ${o} members`);
});
