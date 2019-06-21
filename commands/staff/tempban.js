const ms = require('ms');
const Csr = require('../../banfuncs.js');
const { Command } = require('easy-djs-commandhandler');
// const {staff}=require('./stafflist.json')
const tempban = new Command({
	name: 'tempban',
	aliases: ['tban'],
	description: '(staff) bans an user for a set amount of time',
	hideinhelp: true,
});
module.exports = tempban.execute(async (client, message, args) => {
	if (!message.client.staff.has(message.author.id)) {
		message.channel.send('no permission');
		return;
	}
	const banee =
		message.mentions.users.first() ||
		message.client.users.get(args[0]) ||
		message.client.users.find((x) => x.tag == args.join(' ')) ||
		message.client.users.find((x) => x.username == args.join(' '));
	args.shift();
	const time = args.shift();
	if (!banee) {
		message.channel.send('who do you expect me to ban?');
		return;
	}
	if (!time) {
		message.channel.send('BOI If you dont choose the time');
		return;
	}
	// let banee=message.guild.members.find(x=>x.user.username.toLowerCase().indexOf(args.join(' ').toLowerCase())!=-1)
	if (!banee) {
		return;
	}
	Csr.CSRBan(message.client, banee);
	message.channel.send(
		`Boi <@${banee.id}> you have been temp banned for ${ms(ms(time), {
			long: true,
		})}`
	);
	setTimeout(async () => {
		Csr.CSRUnban(message.client, banee);
		message.channel.send(
			`Unbanned <@${banee.id}>, Ban duration (${ms(time)})`
		);
	}, ms(time));
});
