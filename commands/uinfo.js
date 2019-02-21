const Discord = require('discord.js');
const { staff } = require('./stafflist.json');
function rgbToHex(R, G, B) {return toHex(R) + toHex(G) + toHex(B);}

function toHex(n) {
	n = parseInt(n, 10);
	if (isNaN(n)) return '00';
	n = Math.max(0, Math.min(n, 255));
	return '0123456789ABCDEF'.charAt((n - n % 16) / 16)
         + '0123456789ABCDEF'.charAt(n % 16);
}

module.exports = {
	name: 'uinfo',
	alias:['userinfo'],
	staff:'gets info on a user (--uinfo mention or id)',
	async execute(message, args) {
		if(staff.findIndex(x=>x === message.author.id) !== -1) {
			const d = new Discord.RichEmbed()
				.setColor(rgbToHex(0, 200, 200));

			let svn = '';
			const user = message.mentions.users.first() || message.client.users.get(args[0]) || message.client.users.find(x=>x.tag == args.join(' ')) || message.client.users.find(x=>x.username == args.join(' '));

			message.client.guilds.forEach(async sv => {
				const memb = sv.members.get(user.id);

				if(memb) {
					svn += sv.name + '\n';
					d.setAuthor('information about user: ' + memb.user.username, memb.user.avatarURL);
					d.setThumbnail((memb.user.avatarURL || memb.user.defaultAvatarURL));
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


	},
};