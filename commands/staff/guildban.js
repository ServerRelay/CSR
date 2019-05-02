const dmap = require('dmap-postgres');
const csr = require('../../banfuncs.js');
const { Command } = require('easy-djs-commandhandler');
const guildban = new Command({
	name: 'guildban',
	description: '(staff) bans a whole guild from using CSR services',
});
module.exports = guildban.execute(async (client, message, args) => {
	const db = new dmap('data', {
		connectionString: process.env.DATABASE_URL,
		ssl: true,
	});
	await db.connect();
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
			x =>
				x.name.toLowerCase().indexOf(args.join(' ').toLowerCase()) != -1
		);
	if (!guild) {
		await db.end();
		return message.channel.send('not found');
	}
	let o = 0;
	for (const i of guild.members.array()) {
		if (i.bot) {
			continue;
		}
		o += 1;
		await csr.CSRBan(message.client, i, db);
	}
	message.channel.send(`${guild.name}:banned ${o} members`);
	await db.end();
});
