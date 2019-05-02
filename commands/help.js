const Discord = require('discord.js');
const hlp = {};
module.exports = {
	name: 'help',
	execute(message) {

		message.client.commands.forEach(cmd=> {
			let i = '';
			if(cmd.alias) {
				i = i + ' | ' + cmd.alias.join(' ');
			}
			if(cmd.description) {
				hlp[`${cmd.name}${i}`] = cmd.description;
			}
		});
		const ed = new Discord.RichEmbed()
			.setColor([0, 138, 138]);
		for(const i in hlp) {
			ed.addField(i, hlp[i], false);
		}
		ed.setFooter('help section');
		message.channel.send(ed);
	},
};