const pg = require('pg');
const csr = require('./banfuncs.js');
const { staff } = require('./stafflist.json');

module.exports = {
	name: 'guildunban',
	staff:'unban a whole guild by id or name',
	async execute(message, args) {
		const db = new pg.Client({
			connectionString:process.env.DATABASE_URL,
			ssl:true,
		});
		await db.connect();
		if(!args[0]) {
			return message.channel.send('please specify a server, we dont want accidental unbans');
		}
		if(staff.findIndex(x=>x === message.author.id) == -1) {
			message.channel.send('no permission');
			return;
		}
		const guild = message.client.guilds.get(args[0]) || message.client.guilds.find(x=>x.name.toLowerCase().indexOf(args.join(' ').toLowerCase()) != -1);
		if(guild) {
			let o = 0;
			for(const i of guild.members.array()) {
				o += 1;
				await csr.CSRUnban(message.client, db, i);
			}
			message.channel.send(`${guild.name}:unbanned ${o} members`);
		}
		else{
			return message.channel.send('not found');
		}
	},

};