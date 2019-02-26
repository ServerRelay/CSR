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
	name: 'suggest',
	description: 'sends a suggestion to the bot support server',
	execute(message, args) {

		const ed = new Discord.RichEmbed()
			.setColor(rgbToHex(0, 100, 200));
		ed.setAuthor(message.author.username + ' has sent a suggestion', message.author.avatarURL);
		ed.addField('suggestion:', args.join(' '), false);
		message.client.channels.get('495661800847572992').send(ed)
			.then(async (msg)=>{
				await msg.react('☑');
				await msg.react('❎');
			});


	},
};