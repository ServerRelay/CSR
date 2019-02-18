const { staff } = require('./stafflist.json');
module.exports = {
	name: 'leave',
	staff:'makes the bot leave a server',
	execute(message, args) {
		if(staff.findIndex(x=>x === message.author.id) == -1) {
			message.channel.send('no permission');
			return;
		}
		const guild = message.client.guilds.get(args[0]) || message.client.guilds.find(x=>x.name.toLowerCase().indexOf(args.join(' ').toLowerCase()) != -1);
		if(guild) {
			guild.leave();
			message.channel.send(`left ${guild.name}`);
		}
		else{
			return message.channel.send('not found');
		}
	},
};