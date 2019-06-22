const helper = require('../helper');
const jndb = require('jndb');
const { Command } = require('easy-djs-commandhandler');
const Disconnect = new Command({
	name: 'disconnect',
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
	let db = new jndb.Connection();
	db.use('channels');
	if (!db.has(message.guild.id)) {
		return message.channel.send(
			'this server doesnt have configured channels'
		);
	}
	let channels = db.fetch(message.guild.id);
	let replacer = {};
	if (type == 'public') {
		replacer = { id: null, name: null };
	} else {
		replacer = { id: null, name: null, passcode: null };
	}
	channels[type] = replacer;
	db.insert(message.guild.id, channels);
	message.channel.send('successfully disconnected');
});
