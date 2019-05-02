const discord = require('discord.js');
const { Command } = require('easy-djs-commandhandler');
let staffjoin = new Command({
	name: 'staffjoin',
	hideinhelp: true,
	description: '(staff) allows a staff member to join a server',
	aliases: ['staffjoins'],
});
module.exports = staffjoin.execute(async (client, message, args) => {
	if (!message.client.staff.has(message.author.id)) {
		return message.channel.send('no permission');
	}
	if (!args[0]) {
		return message.channel.send('server name needed');
	}
	const sv = message.client.guilds.find(
		x => x.name.toLowerCase().indexOf(args.join(' ').toLowerCase()) != -1
	);
	if (!sv) {
		return message.author.send(
			'could not find the desired server, either try a more/less precise search or it maybe just doesnt exist'
		);
	}
	if (
		!sv.me.hasPermission('CREATE_INSTANT_INVITE') &&
		!sv.me.hasPermission('ADMINISTRATOR')
	) {
		return message.channel.send(
			'insufficient permissions in the guild you want to join'
		);
	}
	const ch = sv.channels.find(x => x.name === 'irc');
	if (ch) {
		const bans = await sv.fetchBans().catch(rej => {
			message.author.send(`could not get bans from server\n${rej}`);
		});
		if (bans && bans.has(message.author.id)) {
			await sv.unban(message.author.id);
		}
		message.author.send('staff bypass');
		ch.createInvite({ maxAge: 0 }, 'someone requested to join this server')
			.then(invite => {
				message.author.send(`${sv.name}'s invite code:${invite.url}`);
			})
			.catch(err => {
				console.log(err);
			});
	}
	else {
		return message.author.send(
			'server has no #irc channel for me to get an invite from'
		);
	}
});
