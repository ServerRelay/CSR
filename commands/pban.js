const { Command } = require('easy-djs-commandhandler');
const Pban = new Command({
	name: 'pban',
	description:
		'disallows an user from sending messages across servers in a specific guild',
	requires: ['guild'],
	requiresBotPermissions: ['MANAGE_CHANNELS'],
});

module.exports = Pban.execute(async (client, message) => {
	const guild = message.guild;
	const author = message.member;
	const member = message.mentions.members.first();
	if (
		author.id != guild.owner.id &&
		!author.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS'])
	) {
		return message.channel.send(
			'you do not have the necessary permissions for this command'
		);
	}
	if (!member) {
		return message.channel.send('no member found');
	}

	const privateCh = client.system.channels.get(guild.id);
	const channel = client.system.privateChannels.get(guild.id);
	if (privateCh) {
		await privateCh.overwritePermissions({
			permissionOverwrites: [{ id: member.id, deny: 'SEND_MESSAGES' }],
		});
		//await privateCh.overwritePermissions(member.id, {
		//	SEND_MESSAGES: false,
		//});
	}
	if (channel) {
		await channel.overwritePermissions({
			permissionOverwrites: [{ id: member.id, deny: 'SEND_MESSAGES' }],
		});
		//await channel.overwritePermissions(member.id, {
		//	SEND_MESSAGES: false,
		//});
	}
});
