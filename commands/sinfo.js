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
	name: 'sinfo',
	alias:['serverinfo'],
	staff:'gets info on a server,How to use: --sinfo (server name)',
	execute(message, args) {
		if(staff.findIndex(x=>x === message.author.id) !== -1) {
			const d = new Discord.RichEmbed()
				.setColor(rgbToHex(0, 200, 200));
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