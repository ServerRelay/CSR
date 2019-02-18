const Discord = require('discord.js');
const code = require('../ircrules.js');
function rgbToHex(R, G, B) {return toHex(R) + toHex(G) + toHex(B);}

function toHex(n) {
	n = parseInt(n, 10);
	if (isNaN(n)) return '00';
	n = Math.max(0, Math.min(n, 255));
	return '0123456789ABCDEF'.charAt((n - n % 16) / 16)
         + '0123456789ABCDEF'.charAt(n % 16);
}

module.exports = {
	name: 'code',
	alias:['rules'],
	description: 'sends the rules to using the #irc channel',
	execute(message) {
		const ed = new Discord.RichEmbed()
			.setColor(rgbToHex(0, 200, 138));
		ed.setDescription(code);
		ed.setFooter('IRC Code Of Conduct', message.client.user.avatarURL);
		message.channel.send(ed);
	},
};