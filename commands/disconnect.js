const jndb = require('jndb');
const { Command } = require('easy-djs-commandhandler');
const Disconnect = new Command({
	name: 'disconnect',
	requires:['guild'],
	requiresBotPermissions: ['EMBED_LINKS'],
	description: 'disconnects channel from csr',
	usage: 'c-disconnect [public | private]',
});
let allowedTypes = ['public', 'private'];
module.exports = Disconnect.execute((client, message, args) => {
	if (
		message.author.id !== message.guild.owner.id &&
		!client.staff.has(message.author.id)
	) {
		return message.channel.send("you're not allowed to use this command");
	}
	let type = args[0];
	if (!allowedTypes.includes(type)) {
		return message.channel.send('invalid type');
	}
	if (!client.system.db.has(message.guild.id)) {
		return message.channel.send(
			'this server doesnt have configured channels'
		);
	}
	if (type == 'public') {
		client.system.channels.delete(message.guild,'public')
	} else {
		client.system.channels.delete(message.guild,'private')
	}
	
	message.channel.send('successfully disconnected');
});
