const Discord = require('discord.js');
const { Command } = require('easy-djs-commandhandler');
const uinfo = new Command({
	name: 'userinfo',
	aliases: ['uinfo'],
	description: '(staff) gets info on a user',
});
module.exports = uinfo.execute((client, message, args) => {
	if (client.staff.has(message.author.id)) {
		const d = new Discord.RichEmbed().setColor([0, 200, 200]);

		let svn = '';
		const user =
			message.mentions.users.first() ||
			message.client.users.get(args[0]) ||
			message.client.users.find(x => x.tag == args.join(' ')) ||
			message.client.users.find(x => x.username == args.join(' '));
		if (!user) return message.channel.send('No user found!');
		message.client.guilds.forEach(async sv => {
			const memb = sv.members.get(user.id);

			if (memb) {
				svn += sv.name + '\n';
				d.setAuthor(
					'information about user: ' + memb.user.username,
					memb.user.avatarURL
				);
				d.setThumbnail(
					memb.user.avatarURL || memb.user.defaultAvatarURL
				);
				d.setDescription(`
             id:${memb.id}

             servers:
             \`\`\`${svn}
             \`\`\`
             `);
			}
		});
		message.channel.send(d);
	}
});
