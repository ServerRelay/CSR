const dmap = require('dmap-postgres');
const ms = require('ms');
const Csr = require('./banfuncs.js');
// const {staff}=require('./stafflist.json')

module.exports = {
	name: 'tempban',
	alias:['tban'],
	staff:'bans an user for a set ammount of time',
	async execute(message, args) {
		const db = new dmap('data', {
			connectionString:process.env.DATABASE_URL,
			ssl:true,
		});
		await db.prepared;
		if(!message.client.staff.has(message.author.id)) {
			message.channel.send('no permission');
			return;
		}
		const banee = message.mentions.users.first() || message.client.users.get(args[0]) || message.client.users.find(x=>x.tag == args.join(' ')) || message.client.users.find(x=>x.username == args.join(' '));
		args.shift();
		const time = args.shift();
		if(!banee) {
			message.channel.send('who do you expect me to ban?');
			return await db.end();
		}
		if(!time) {
			message.channel.send('BOI If you dont choose the time');
			return await db.end();
		}
		// let banee=message.guild.members.find(x=>x.user.username.toLowerCase().indexOf(args.join(' ').toLowerCase())!=-1)
		if(!banee) {return await db.end();}
		await Csr.CSRBan(message.client, banee, db);
		message.channel.send(`Boi <@${banee.id}> you have been temp banned for ${ms(ms(time), { long:true })}`);
		setTimeout(async () => {
			await Csr.CSRUnban(message.client, banee, db);
			message.channel.send(`Unbanned <@${banee.id}>, Ban duration (${ms(time)})`);
			await db.end();
		}, ms(time));


	},

};