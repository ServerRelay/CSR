const { Command } = require('easy-djs-commandhandler');
module.exports = new Command({
	name: 'prefix',
	description: '',
	requires: ['guild'],
}).execute((client, message, args) => {
	const currpref = client.prefixDB.fetch(message.guild.id) || client.prefix;
	if (
		!message.member ||
		!message.member.permissions.has('MANAGE_GUILD') ||
		!args[0]
	)
		return message.channel.send('The prefix is `' + currpref + '`');

	const pref = args.join(' ');

	if (pref == 'default') {
		client.prefixDB.delete(message.guild.id);
		return message.channel.send(
			'prefix had been reset to `' + client.prefix + '`'
		);
	}
	client.prefixDB.insert(message.guild.id, pref);
	return message.channel.send(`prefix has been set to \`${pref}\``);
});
