const Discord = require('discord.js');
const hlp = [];
module.exports = {
	name: 'staffhelp',
	description: 'CSR staff\'s help command',
	execute(message) {

		message.client.commands.forEach(cmd=> {
			let i = '';
			if(cmd.alias) {
				i = i + ' | ' + cmd.alias.join(' ');
			}
			if(cmd.staff) {
				hlp[`${cmd.name}${i}`] = cmd.staff;
			}
			// message.client.commands.delete(command.name)


		});
		const ed = new Discord.RichEmbed()
			.setColor([0, 138, 138]);

		for(const i in hlp) {
			ed.addField(i, hlp[i], false);
		}

		ed.setFooter('', message.client.user.avatarURL);

		message.channel.send(ed);


	},
};