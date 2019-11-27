const { Command } = require('easy-djs-commandhandler');
module.exports = new Command({
	name: 'testwebhooks',
	description: '',
	aliases: [],
	requires: ['guild', 'botowner'],
	requiresBotPermissions: [],
}).execute(async (client, message, args) => {
	const guild = message.guild;
	message.author = client.user;
	message.content = 'test';
	let failed = false;
	let failReason = '';
	let webhooks = client.system.webhookManager.get(guild);
	if (!webhooks.public && !webhooks.private) {
		message.channel.send(
			'❌ failed: could not find any webhooks belonging to this guild'
		);
		return;
	}
	if (webhooks.public) {
		await client.system.webhookManager
			.send(webhooks.public, message)
			.catch((err) => {
				(failed = true), (failReason = err);
			});
	}
	if (webhooks.private && !failed) {
		await client.system.webhookManager
			.send(webhooks.private, message)
			.catch((err) => {
				(failed = true), (failReason = err);
			});
	}
	if (failed) {
		message.channel.send('❌ failed: ' + failReason);
		return;
	}
	message.channel.send('✅ success: everything seems to be working');
});
