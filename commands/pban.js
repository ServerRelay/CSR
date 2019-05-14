const { Command } = require('easy-djs-commandhandler');
const Pban = new Command({
	name: 'pban',
	require: 'dm',
	requiresBotPermissions: ['MANAGE_CHANNELS'],
});

module.exports = Pban.execute(async (client, message) => {
	const guild = message.guild;
	const author = message.member;
	const member = message.mentions.members.first();
	if (
		!author.id == guild.owner.id &&
		author.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS'])
	) {
		return message.channel.send(
			'you do not have the necessary permissions for this command'
		);
	}
	if (!member) {
		return message.channel.send('no member found');
	}

	const privateCh = client.system.getPrivateChannel(guild);
	if (!privateCh) {
		return;
	}
	await privateCh.overwritePermissions(member.id, {
		SEND_MESSAGES: false,
	});
});
