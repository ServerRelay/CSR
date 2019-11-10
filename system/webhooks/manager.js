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
		setInterval(async () => {
			await this.cleanup();
		}, 300000);
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
				if (this.webhooks.public.has(ch.guild.id)) return;
				// @ts-ignore
				let webhooks = await ch.fetchWebhooks().catch((e) => {});
				if (!webhooks) continue;
				let webhook = webhooks.first();
				if (!webhook) {
					// @ts-ignore
					webhook = await ch
						.createWebhook('csr', this.client.user.displayAvatarURL)
						// @ts-ignore
						.catch((e) => {});
				}
				this.webhooks.public.set(ch.guild.id, webhook);
			}
		}
		if (this.webhooks.private.size !== privchannels.size) {
			for (let i of privchannels) {
				let ch = i[1];
				if (this.webhooks.private.has(ch.guild.id)) return;
				// @ts-ignore
				let webhooks = await ch.fetchWebhooks().catch((e) => {});
				if (!webhooks) continue;
				let webhook = webhooks.first();
				if (!webhook) {
					// @ts-ignore
					webhook = await ch
						.createWebhook('csr', this.client.user.displayAvatarURL)
						// @ts-ignore
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
		//await webhook.edit(user.tag, user.avatarURL);
		parsed.username = user.tag;
		parsed.avatarURL = user.avatarURL;
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
	async cleanup() {
		let pubchannels = this.system.channels.public;
		let privchannels = this.system.channels.private;
		pubchannels.forEach(async (ch) => {
			let webhooks = await ch.fetchWebhooks();
			if (!webhooks) return;
			let webhookToGet = this.webhooks.public.get(ch.guild.id);
			if (!webhookToGet) {
				return;
			}
			let got = webhooks.get(webhookToGet.id);
			if (!got) {
				this.webhooks.public.delete(ch.guild.id);
			}
		});
		privchannels.forEach(async (ch) => {
			let webhooks = await ch.fetchWebhooks();
			if (!webhooks) return;
			let webhookToGet = this.webhooks.private.get(ch.guild.id);
			if (!webhookToGet) {
				return;
			}
			let got = webhooks.get(webhookToGet.id);
			if (!got) {
				this.webhooks.private.delete(ch.guild.id);
			}
		});
	}
}
module.exports = WebHookManager;
