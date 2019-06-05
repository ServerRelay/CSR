const { Command } = require('easy-djs-commandhandler');
const staffjoin = new Command({
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
	const svs = [];
	message.client.guilds.forEach(guild => {
		if (guild.name.toLowerCase().includes(args.join(' ').toLowerCase())) {
			svs.push(guild);
		}
	});
	if (!svs.length) {
		return message.author.send(
			'could not find the desired server, either try a more/less precise search or it maybe just doesnt exist'
		);
	}
	const msg =
		svs.length > 1
			? await message.author.send(
				`this is a list of possible servers that were found:\`\`\`\n${svs
					.map((x, idx) => idx + '. ' + x.name)
					.join(
						'\n'
					)}\`\`\`\nplease type the number that corresponds with the server to select it`,
				{ split: true }
			)
			: await message.author.send('there was only 1 server found');
	const filter = m => !m.author.bot;
	const collector =
		svs.length > 1
			? await msg.channel.awaitMessages(filter, { max: 1, time: 60000 })
			: '';
	if (svs.length > 1 && !collector.size) {
		return message.author.send('no choice made');
	}
	const guild = svs.length > 1 ? svs[collector.first().content] : svs[0];
	if (!guild) {
		return message.author.send(
			'invalid index'
		);
	}
	if (
		!guild.me.hasPermission('CREATE_INSTANT_INVITE') &&
		!guild.me.hasPermission('ADMINISTRATOR')
	) {
		return message.channel.send(
			'insufficient permissions in the guild you want to join'
		);
	}
	const ch = guild.channels.find(x => x.name === 'irc');
	if (ch) {
		const bans = await guild.fetchBans().catch(rej => {
			message.author.send(`could not get bans from server\n${rej}`);
		});
		if (bans && bans.has(message.author.id)) {
			await guild.unban(message.author.id);
		}
		message.author.send('staff bypass');
		const invite = await ch.createInvite({ maxAge: 0 }, 'staff requested to join this server').catch(rej=>{
			message.author.send('cannot get a server invite');
		});
		if(invite) {
			message.author.send(`${guild.name}'s invite code:${invite.url}`);
		}
	}
	else {
		message.author.send(
			'server has no #irc channel for me to get an invite from, using another channel'
		);
		const bans = await guild.fetchBans().catch(rej => {
			message.author.send(`could not get bans from server\n${rej}`);
		});
		if (bans && bans.has(message.author.id)) {
			await guild.unban(message.author.id);
		}
		const backupChannels = guild.channels.filter(x=>x.type == 'text');
		const backupChannel = backupChannels.first();
		if(!backupChannel) {
			return message.author.send('no channel to create invite from');
		}
		message.author.send(`using ${backupChannel.name}`);
		const invite = await backupChannel.createInvite({ maxAge:0 }, 'staff requested to join this server');
		message.author.send(`${guild.name}'s invite code:${invite.url}`);
	}
});
