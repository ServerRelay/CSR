const discord = require('discord.js');

/**
 *
 * @param {discord.Message} message
 */
function parseMessage(message) {
	let embeds = message.embeds;
	let attachments = message.attachments.map((attch) => attch.proxyURL);
	return { content: message.cleanContent, embeds, files: attachments };
}
/**
 *
 * @param {discord.Webhook} webhook
 * @param {discord.Message} message
 */
async function sendWebhook(webhook, message) {
	let user = message.author;
	let parsed = this.parseMessage(message);
	let content = parsed.content;
	parsed.username = user.tag;
	parsed.avatarURL = user.avatarURL;
	await webhook.send(content, parsed);
}

module.exports = { parseMessage, sendWebhook };
