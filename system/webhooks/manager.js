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
		let pubchannels = this.system.channelStore.public;
		let privchannels = this.system.channelStore.private;
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
		let pubchannels = this.system.channelStore.public;
		let privchannels = this.system.channelStore.private;
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
	/**
	 *
	 * @param {import('discord.js').Guild} guild
	 * @param {{public?:import('discord.js').Webhook,private?:import('discord.js').Webhook}} webhooks
	 * @returns {{public:boolean,private:boolean}} whethere it was successful in adding the specified webhooks, returns undefined for the type of webhook that wasnt inputted
	 */
	add(guild, webhooks) {
		const gid = guild.id;
		const results = { public: undefined, private: undefined };
		if (webhooks.private) {
			if (!this.webhooks.private.has(gid)) {
				this.webhooks.private.set(gid, webhooks.private);
				results.private = true;
			} else {
				results.private = false;
			}
		}
		if (webhooks.public) {
			if (!this.webhooks.public.has(gid)) {
				this.webhooks.public.set(gid, webhooks.public);
				results.public = true;
			} else {
				results.public = false;
			}
		}
		return results;
	}
	/**
	 *
	 * @param {import('discord.js').Guild} guild
	 * @param {'public'|'private'} webhook
	 */
	delete(guild, webhook) {
		const gid = guild.id;
		let result = false;
		if (webhook == 'public') {
			if (this.webhooks.public.has(gid)) {
				this.webhooks.public.delete(gid);
				result = true;
			}
		} else if (webhook == 'private') {
			if (this.webhooks.private.has(gid)) {
				this.webhooks.private.delete(gid);
				result = true;
			}
		}
		return result;
	}
	/**
	 *
	 * @param {import('discord.js').Guild} guild
	 * @param {{public?:import('discord.js').Webhook,private?:import('discord.js').Webhook}} webhooks
	 */
	edit(guild, webhooks) {
		const gid = guild.id;
		if (webhooks.private) {
			this.webhooks.private.set(gid, webhooks.private);
		}
		if (webhooks.public) {
			this.webhooks.public.set(gid, webhooks.public);
		}
	}
	/**
	 *
	 * @param {import('discord.js').Guild} guild
	 * @returns {{public:import('discord.js').Webhook,private:import('discord.js').Webhook}}
	 */
	get(guild) {
		const gid = guild.id;
		const results = {
			public: this.webhooks.public.get(gid),
			private: this.webhooks.private.get(gid),
		};
		return results;
	}
}
module.exports = WebHookManager;
