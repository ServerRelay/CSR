const dmap = require('dmap-postgres');
const csr = require('./banfuncs.js');
const { staff } = require('./stafflist.json');

module.exports = {
	name: 'guildban',
	staff:'ban a whole guild by id or name',
	async execute(message, args) {
		const db = new dmap('data', {
			connectionString:process.env.DATABASE_URL,
			ssl:true,
		});
		await db.prepared;
		if(!args[0]) {
			return message.channel.send('please specify a server, we dont want accidental bans');
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
				await csr.CSRBan(message.client, i, db);
			}
			message.channel.send(`${guild.name}:banned ${o} members`);
		}
		else{
			return message.channel.send('not found');
		}
	},

};