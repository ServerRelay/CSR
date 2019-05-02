const { Command } = require('easy-djs-commandhandler');
const Discord = require('discord.js');
const help = new Command({ name:'help', hideinhelp:'true' });
module.exports = help.execute((client, message)=>{

	const hlp = {};
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
});