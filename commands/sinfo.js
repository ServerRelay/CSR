const Discord = require('discord.js');

module.exports = {
	name: 'sinfo',
	alias:['serverinfo'],
	staff:'gets info on a server,How to use: --sinfo (server name)',
	execute(message, args) {
		if(message.client.staff.has(message.author.id)) {
			const d = new Discord.RichEmbed()
				.setColor([0, 200, 200]);
			const sv = message.client.guilds.find(x=>x.name.toLowerCase().indexOf(args.join(' ').toLowerCase()) != -1);
			d.setAuthor('information about server: ' + sv.name, sv.iconURL);
			if(sv) {
				d.addField('server owner', sv.owner + '\ntag: ' + sv.owner.user.tag, false);
				d.setThumbnail((sv.owner.avatarURL || sv.owner.defaultAvatarURL));
				d.addField('server id', sv.id, false);

				let x = 0;
				let bot = 0;

				for(const i of sv.members.array()) {

					if(i.user.bot === true) {
						bot += 1;
					}
					else{
						x += 1;
					}
					// console.log(i)
				}
				d.addField(`members: ${sv.members.size}`, `members: ${x}/ bots: ${bot}`, false);
			}
			message.channel.send(d);
		}


	},
};