const dmap = require('dmap-postgres');
const csr = require('./banfuncs.js');

module.exports = {
	name: 'guildunban',
	staff:'unban a whole guild by id or name',
	async execute(message, args) {
		const db = new dmap('data', {
			connectionString:process.env.DATABASE_URL,
			ssl:true,
		});
		await db.prepared;
		if(!args[0]) {
			return message.channel.send('please specify a server, we dont want accidental unbans');
		}
		if(!message.client.staff.has(message.author.id)) {
			message.channel.send('no permission');
			return;
		}
		const guild = message.client.guilds.get(args[0]) || message.client.guilds.find(x=>x.name.toLowerCase().indexOf(args.join(' ').toLowerCase()) != -1);
		if(!guild) {
			await db.end();
			return message.channel.send('not found');
		}
		let o = 0;
		for(const i of guild.members.array()) {
			if(i.bot) {
				continue;
			}
			o += 1;
			await csr.CSRUnban(message.client, i, db);
		}
		message.channel.send(`${guild.name}:unbanned ${o} members`);
		await db.end();
	},

};
