const Discord = require('discord.js');
const { Command } = require('easy-djs-commandhandler');
const sysmsg = new Command({ name: 'sysmsg', requires: ['botowner'] });
module.exports = sysmsg.execute((client, message, args) => {
	if (message.author.id != '298258003470319616') {
		return;
	}

	const relayEmbed = new Discord.RichEmbed()
		.setTitle('**Message**')
		.setTimestamp(new Date())
		.setColor([20,110,164,0.62])
		if(args.length){
			relayEmbed.setDescription(args.join(' '));
		}
	// find and add image
	if(message.attachments.array()[0]) {
		const img = message.attachments.array()[0];
		if(img.filename.endsWith('.jpg') || img.filename.endsWith('.png') || img.filename.endsWith('.gif') || img.filename.endsWith('.jpeg') || img.filename.endsWith('.PNG')) {
			relayEmbed.setImage(img.url);
		}
		else{
			relayEmbed.addField('Attachment', img.url, false);
		}

	}
	// fetch external embeds and place them there
	const externalembed = new Discord.RichEmbed(message.embeds[0]);
	// if(externalembed) {
	externalembed.title && externalembed.description ? relayEmbed.addField(`${externalembed.title}`, externalembed.description) : '';
	externalembed.thumbnail ? relayEmbed.setThumbnail(externalembed.thumbnail.url) : '';

	client.system.sendAll(relayEmbed);
	client.system.sendAllPrivate(relayEmbed);
});
