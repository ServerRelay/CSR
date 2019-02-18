const pg = require('pg');
const csr = require('./banfuncs.js');
const { staff } = require('./stafflist.json');

module.exports = {
	name: 'ban',
	staff:'adds someone to the ban database How to use: --ban (@mention)',
	async execute(message, args) {
		const db = new pg.Client({
			connectionString:process.env.DATABASE_URL,
			ssl:true,
		});
		await db.connect();

		if(staff.findIndex(x=>x === message.author.id) == -1) {
			message.channel.send('no permission');
			return;
		}
		const banee = message.mentions.members.first() || message.client.users.get(args[0]);
		// let banee=message.guild.members.find(x=>x.user.username.toLowerCase().indexOf(args.join(' ').toLowerCase())!=-1)
		if(banee) {
			await csr.CSRBan(message.client, db, banee);
			message.channel.send(`${message.client.users.get(banee.id).username} has been banned`);
			await db.end();
		}
		else{
			message.channel.send('not found');
			await db.end();
		}

	},

};