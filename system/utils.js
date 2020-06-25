const discord = require('discord.js');
class Utils {
	constructor(){

	}
	/**
	 *
	 * @param {discord.Message} message
	 */
	parseMessage(message) {
		let embeds = message.embeds;
		let attachments = message.attachments.map((attch) => attch.proxyURL);
		return { content: message.cleanContent, embeds, files: attachments };
	}
	/**
	 *
	 * @param {discord.Webhook} webhook
	 * @param {discord.Message} message
	 */
	async sendWebhook(webhook, message) {
		let user = message.author;
		let parsed = this.parseMessage(message);
		let content = parsed.content;
		parsed.username = user.tag;
		parsed.avatarURL = user.avatarURL;
		await webhook.send(content, parsed);
	}
	/**
	 *
	 * @param {string} name
	 * @returns {discord.Emoji}
	 */
	findEmoji(name) {
		const res = this.client.emojis.find((x) => x.name == name);
		return res;
	}
}
module.exports = new Utils();
