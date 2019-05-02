const Discord = require('discord.js');
const { Command } = require('easy-djs-commandhandler');
const join = new Command({
	name: 'join',
	aliases: ['joins'],
	description: 'sends a join request to a desired server',
});
module.exports = join.execute(async (client, message, args) => {
	if (!args[0]) return message.channel.send('please specify a server name');
	if (message.client.banlist.has(message.author.id)) {
		return message.channel.send('not allowed');
	}

	const ed = new Discord.RichEmbed().setColor([138, 0, 138]);
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
	const authchannel = msg.channel;
	if (!guild) {
		return authchannel.send('invalid index');
	}
	if (guild.id == '495583899104182275') {
		const ch = guild.channels.find(x => x.name === 'irc');
		const inv = await ch.createInvite(
			'someone requested to join this server'
		);
		return await message.author.send(
			`request to join \`${guild.name}\` has been aproved\n${inv}`
		);
	}
	const ch = guild.channels.find(x => x.name === 'irc');
	if (!ch) return authchannel.send('Server has no #irc channel!');

	message.author.send(`awaiting aproval from ${guild.name}...`);
	const rq = await guild
		.createChannel('irc request', 'text', [
			{
				id: guild.id,
				deny: ['MANAGE_MESSAGES'],
				allow: [],
			},
			{
				id: message.client.user.id,
				deny: [],
				allow: 805829713,
			},
		])
		.catch(() => {
			guild.owner
				.send(
					`Somebody tried to join ${
						guild.name
					} server but i could not create a #irc-requests channel!`
				)
				.catch(() => {
					ch.send(
						'Somebody tried to join this server but i could not create a #irc-requests channel!'
					);
				});
		});
	if (!rq) return;
	try {
		await rq.overwritePermissions(guild.id, { VIEW_CHANNEL: false });
		guild.roles.forEach(async role => {
			if (!role.hasPermission('KICK_MEMBERS')) {
				return;
			}
			await rq
				.overwritePermissions(role.id, { VIEW_CHANNEL: true })
				.catch(() => {
					rq.send('I C');
				});
		});

		ed.setAuthor(
			`user ${message.author.username} is requesting an invite`,
			message.author.avatarURL || message.author.defaultAvatarURL
		);
		ed.addField('Tag', `${message.author.tag}`, false);
		ed.addField('server:', guild.name, false);
		// ed.addField('role in server',message.author.roles.first().name)
		const perm = await rq.send(ed);
		await perm.react('✅');
		await perm.react('❎');

		const reqfilter = (reaction, user) =>
			(reaction.emoji.name === '✅' || reaction.emoji.name === '❎') &&
			!user.bot;
		const reqcollector = await perm.awaitReactions(reqfilter, {
			maxEmojis: 1,
		}); // {time:60000}
		if (reqcollector.has('❎')) {
			// sv.owner.send('sending refusal')
			message.author.send('denied permission');
			rq.delete();
			return;
		}
		if (reqcollector.has('✅')) {
			ch.createInvite('someone requested to join this server')
				.then(invite => {
					message.author.send(
						`${guild.name}'s invite code:${invite.url}`
					);
				})
				.catch(err => {
					console.log(err);
				});
			rq.delete();
			return;
		}

		// sv.owner.send(RichEmbed=ed)

		if (!collector.size) {
			message.author.send('no response try again later');
			rq.delete();
		}
	}
	catch (err) {
		message.channel.send(
			'While trying to join the Server an error occured!'
		);
		rq.send(
			'Somebody tried to join your server, but something went wrong!'
		);
	}
});
