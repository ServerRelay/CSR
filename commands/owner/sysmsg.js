const Discord = require('discord.js');
const { Command } = require('easy-djs-commandhandler');
const helper = require('../../helper');
const sysmsg = new Command({ name: 'sysmsg', requires: ['botowner'] });
module.exports = sysmsg.execute((client, message, args) => {
	if (message.author.id != '298258003470319616') {
		return;
	}
	const ed = new Discord.RichEmbed().setColor([255, 0, 0]);
	ed.addField('**IMPORTANT MESSAGE**', args.join(' '), false);

	client.guilds.forEach(async guild => {
		const ch = helper.getChannel(guild);
		if (!ch) return;
		await ch.send(ed);
	});
});
