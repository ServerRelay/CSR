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
	name: 'invite',
	description: 'sends a link to invite the bot',
	execute(message) {
		const ed = new Discord.RichEmbed()
			.setColor(rgbToHex(0, 255, 40))
			.setFooter('CSR', message.client.user.avatarURL);
		message.client.generateInvite(['ADMINISTRATOR'])
			.then(link=>{
				ed.setDescription(`thanks for choosing to invite the bot.\n invite:
        ${link}`);
				message.channel.send(ed);
			})
			.catch(console.error);


	},
};