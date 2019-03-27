const Discord = require('discord.js');
function rgbToHex(R, G, B) {return toHex(R) + toHex(G) + toHex(B);}

function toHex(n) {
	n = parseInt(n, 10);
	if (isNaN(n)) return '00';
	n = Math.max(0, Math.min(n, 255));
	return '0123456789ABCDEF'.charAt((n - n % 16) / 16)
         + '0123456789ABCDEF'.charAt(n % 16);
}

module.exports = {
	name: 'join',
	alias:['joins'],
	description: 'sends a join request to a server',
	/**
     *
     * @param {Discord.Message} message
     * @param {[]} args
     */
	async execute(message, args) {
		if(!args[0]) return message.channel.send('please specify a server name');
		if(message.client.banlist.has(message.author.id)) return message.channel.send('not allowed');

		const ed = new Discord.RichEmbed()
			.setColor(rgbToHex(138, 0, 138));

		const sv = message.client.guilds.get(args.join(' ')) || message.client.guilds.find(g => g.name === args.join(' ')) || message.client.guilds.find(x=>x.name.toLowerCase().indexOf(args.join(' ').toLowerCase()) != -1);
		if(!sv) return message.author.send('could not find the desired server, either try a more/less precise search or it maybe just doesnt exist');

		const ch = sv.channels.find(x=>x.name === 'irc');
		if (!ch) return message.channel.send('Server has no #irc channel!');
		message.author.send(`awaiting aproval from ${sv.name}...`);
		const rq = await sv.createChannel('irc request', 'text', [{
			id: sv.id,
			deny: ['MANAGE_MESSAGES'],
			allow: [],
		},
		{
			id: message.client.user.id,
			deny: [],
			allow: 805829713,
		}]
		).catch(() => {
			sv.owner.send(`Somebody tried to join ${sv.name} server but i could not create a #irc-requests channel!`).catch(()=>{
				ch.send('Somebody tried to join this server but i could not create a #irc-requests channel!');
			});
		});
		if(!rq) return;
		try{
			await rq.overwritePermissions(sv.id, { 'VIEW_CHANNEL':false });
			sv.roles.forEach(async role => {
				if(!role.hasPermission('KICK_MEMBERS')) {return;}
				await rq.overwritePermissions(role.id, { 'VIEW_CHANNEL':true })
					.catch(()=>{
						rq.send('I C');
					});
			});

			ed.setAuthor(`user ${message.author.username} is requesting an invite`, message.author.avatarURL || message.author.defaultAvatarURL);
			ed.addField('Tag', `${message.author.tag}`, false);
			ed.addField('server:', sv.name, false);
			// ed.addField('role in server',message.author.roles.first().name)
			const perm = await rq.send(ed);
			await perm.react('✅');
			await perm.react('❎');

			const filter = (reaction, user)=>(reaction.emoji.name === '✅' || reaction.emoji.name === '❎') && !user.bot;
			const collector = await perm.awaitReactions(filter, { maxEmojis:1 });// {time:60000}
			if(collector.has('❎')) {
				// sv.owner.send('sending refusal')
				message.author.send('denied permission');
				rq.delete();
				return;
			}
			if(collector.has('✅')) {

				ch.createInvite('someone requested to join this server')
					.then((invite)=>{
						message.author.send(`${sv.name}'s invite code:${invite.url}`);

					})
					.catch((err)=>{
						console.log(err);
					});
				rq.delete();
				return;
			}

			// sv.owner.send(RichEmbed=ed)

			if(!collector.size) {

				message.author.send('no response try again later');
				rq.delete();
			}

		}
		catch(err) {
			message.channel.send('While trying to join the Server an error occured!');
			rq.send('Somebody tried to join your server, but something went wrong!');
		}


	},
};