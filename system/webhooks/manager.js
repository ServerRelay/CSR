const ms=require('ms')
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
		setInterval(() => {
			this.update();
		}, ms('30m'));
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
	cleanup() {

		this.webhooks.private.forEach((wb, gid) => {
			let guild = this.client.guilds.get(gid);
			if (!guild) {
				this.webhooks.private.delete(gid);
			}
			let channel = guild.channels.get(wb.channelID);
			if (!channel) this.webhooks.private.delete(gid);
		});
	}
	async update() {
		this.webhooks.public.clear();
		this.webhooks.private.clear();
		await this.fetchWebhooks();
	}
}
module.exports = WebHookManager;
