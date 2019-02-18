module.exports = {
	name: 'leave',
	execute(message, args) {
		if(message.author.id !== '298258003470319616') {
			return message.send('nope');
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