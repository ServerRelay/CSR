const Discord = require('discord.js');
const fs = require('fs');
function rgbToHex(R, G, B) {return toHex(R) + toHex(G) + toHex(B);}

function toHex(n) {
	n = parseInt(n, 10);
	if (isNaN(n)) return '00';
	n = Math.max(0, Math.min(n, 255));
	return '0123456789ABCDEF'.charAt((n - n % 16) / 16)
         + '0123456789ABCDEF'.charAt(n % 16);
}
const hlp = [];
module.exports = {
	name: 'staffhelp',
	description: 'CSR staff\'s help command',
	execute(message) {


		const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {

			const command = require(`./${file}`);
			let i = '';
			if(command.alias) {
				i = i + ' | ' + command.alias.join(' ');
			}
			if(command.staff) {
				hlp[`${command.name}${i}`] = command.staff;
			}
			// message.client.commands.delete(command.name)


		}
		const ed = new Discord.RichEmbed()
			.setColor(rgbToHex(0, 138, 138));

		for(const i in hlp) {
			ed.addField(i, hlp[i], false);
		}

		ed.setFooter('', message.client.user.avatarURL);

		message.channel.send(ed);


	},
};