class WebHookManager {
	/**
	 *
	 * @param {import('../main')} system
	 */
	constructor(system) {
		this.system = system;
		this.client = system.client;
	}
	/**
	 * @returns {Promise<{public:Map<string,import('discord.js').Webhook>,privaye:Map<string,import('discord.js').Webhook>}>}
	 */
	async fetchWebhooks() {
		let pubmap = new Map();
		let privmap = new Map();
		let pubchannels = this.system.channels.public;
		let privchannels = this.system.channels.private;
		for (let i of pubchannels) {
			let ch = i[1];
			let webhooks = await ch.fetchWebhooks();
			let webhook = webhooks.first();
			if (!webhook) {
				webhook = await ch.createWebhook(
					'csr',
					this.client.user.displayAvatarURL
				);
			}
			pubmap.set(ch.guild.id, webhook);
		}
		for (let i of privchannels) {
			let ch = i[1];
			let webhooks = await ch.fetchWebhooks();
			let webhook = webhooks.first();
			if (!webhook) {
				webhook = await ch.createWebhook(
					'csr',
					this.client.user.displayAvatarURL
				);
			}
			privmap.set(ch.guild.id, webhook);
		}
		return { public: pubmap, private: privmap };
	}
	/**
	 *
	 * @param {import('discord.js').Webhook} webhook
	 * @param {import('discord.js').User} user
	 * @param {string |import('discord.js').RichEmbed} content
	 */
	async send(webhook, user, content) {
		await webhook.edit(user.tag, user.avatarURL);
		await webhook.send(content);
	}
}
module.exports = WebHookManager;
