class WebHookManager {
	/**
	 *
	 * @param {import('../main')} system
	 */
	constructor(system) {
		this.system = system;
		this.client = system.client;
		/**
		 * @type {{public:Map<string,import('discord.js').Webhook>,private:Map<string,import('discord.js').Webhook>}}
		 */
		this.webhooks = { public: new Map(), private: new Map() };
	}
	/**
	 * @returns {Promise<{public:Map<string,import('discord.js').Webhook>,private:Map<string,import('discord.js').Webhook>}>}
	 */
	async fetchWebhooks() {
		let pubchannels = this.system.channels.public;
		let privchannels = this.system.channels.private;
		if (this.webhooks.public.size !== pubchannels.size) {
			for (let i of pubchannels) {
				let ch = i[1];
				let webhooks = await ch.fetchWebhooks().catch((e) => {});
				if (!webhooks) continue;
				let webhook = webhooks.first();
				if (!webhook) {
					webhook = await ch
						.createWebhook('csr', this.client.user.displayAvatarURL)
						.catch((e) => {});
				}
				this.webhooks.public.set(ch.guild.id, webhook);
			}
		}
		if (this.webhooks.private.size !== privchannels.size) {
			for (let i of privchannels) {
				let ch = i[1];
				let webhooks = await ch.fetchWebhooks().catch((e) => {});
				if (!webhooks) continue;
				let webhook = webhooks.first();
				if (!webhook) {
					webhook = await ch
						.createWebhook('csr', this.client.user.displayAvatarURL)
						.catch((e) => {});
				}
				this.webhooks.private.set(ch.guild.id, webhook);
			}
		}
		return this.webhooks;
	}
	/**
	 *
	 * @param {import('discord.js').Webhook} webhook
	 * @param {import('discord.js').Message} message
	 */
	async send(webhook, message) {
		let user = message.author;
		let parsed = this.parseMessage(message);
		let content = parsed.content;
		await webhook.edit(user.tag, user.avatarURL);
		await webhook.send(content, parsed);
	}
	/**
	 *
	 * @param {import('discord.js').Message} message
	 */
	parseMessage(message) {
		let embeds = message.embeds;
		let attachments = message.attachments.map((attch) => attch.proxyURL);
		return { content: message.cleanContent, embeds, files: attachments };
	}
}
module.exports = WebHookManager;
