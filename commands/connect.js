const jndb = require('jndb');
const { Command } = require('easy-djs-commandhandler');
const Connect = new Command({
	name: 'connect',
	requires: ['guild'],
	requiresBotPermissions: ['EMBED_LINKS'],
	description: "connects to CSR's main chat",
	usage: 'c-connect [channel] [public | private] [passcode]',
});
let allowedTypes = ['public', 'private'];
/** @param {import("../bot")} callback */
module.exports = Connect.execute((client, message, args) => {
	if (
		message.author.id !== message.guild.owner.id &&
		!client.staff.has(message.author.id)
	) {
		return message.channel.send("you're not allowed to use this command");
	}
	let channel =
		message.mentions.channels.first() ||
		message.guild.channels.get(args[0]);
	let type = args[1];
	let passcode = args[2];
	if (!channel || channel.type !== 'text') {
		return message.channel.send('invalid channel provided');
	}
	if (!allowedTypes.includes(type)) {
		return message.channel.send('invalid type');
	}
	if (type == 'public') {
		let pChannel = client.system.privateChannels.get(message.guild.id);
		if (pChannel && channel.id == pChannel.id) {
			return message.channel.send(
				"public channel can't be the same as private channel"
			);
		}
	} else if (type == 'private') {
		let pChannel = client.system.channels.get(message.guild.id);
		if (pChannel && channel.id == pChannel.id) {
			return message.channel.send(
				"private channel can't be the same as the public channel"
			);
		}
	}
	if (type == 'public') {
		client.system.update(message.guild, channel, 'public');
		let rules = client.rules;
		channel.send(
			'**make sure you read the rules before proceding**',
			rules
		);
	} else {
		if (!args[2] || args[2] == '') {
			return message.channel.send('passcode is empty or invalid');
		}
		channel.passcode = passcode;
		client.system.update(message.guild, channel, 'private');
	}
	message.channel.send('successfully set');
});
