const dmap = require('dmap-postgres');
const csr = require('./banfuncs.js');
const { staff } = require('./stafflist.json');
module.exports = {
	name: 'unban',
	staff:'removes someone from the database How to use: --unban (@mention)',
	async execute(message, args) {
		const db = new dmap('data', {
			connectionString:process.env.DATABASE_URL,
			ssl:true,
		});
		await db.prepared;
		if(staff.findIndex(x=>x === message.author.id) == -1) {
			message.channel.send('no permission');
			return;
		}
		// let banee=message.guild.members.find(x=>x.user.username.toLowerCase().indexOf(args.join(' ').toLowerCase())!=-1)
		const banee = message.mentions.users.first() || message.client.users.get(args[0]) || message.client.users.find(x=>x.tag == args.join(' ')) || message.client.users.find(x=>x.username == args.join(' '));
		if(banee) {
			await csr.CSRUnban(message.client, banee,db);
			message.channel.send('removed from DB');
			await db.end();
		}


	},

};