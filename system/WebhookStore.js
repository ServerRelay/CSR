const { Webhook } = require('discord.js');
const Base = require('./BaseStore');
class WebhookStore extends Base {
	/**
	 *
	 * @param {import('./')} system
	 */
	constructor(system) {
		super();
		this.system = system;
		this.client = system.client;
		/**
		 * @type {Map<string,GuildWebhooks>}
		 */
		this.container = new Map();
	}
	init() {
		this.system.channelStore.container.forEach(async (chs, gid) => {
			let pubchannel = chs.public;
			let privchannel = chs.private;
			let webhooksObj = {
				public: undefined,
				private: undefined,
			};
			if (pubchannel) {
				let webhooks = await pubchannel
					.fetchWebhooks()
					.catch((e) => {});
				if (!webhooks) return;
				let webhook = webhooks.first();
				if (!webhook) {
					// @ts-ignore
					webhook = await pubchannel
						.createWebhook('csr', this.client.user.displayAvatarURL)
						// @ts-ignore
						.catch((e) => {});
				}
				webhooksObj.public = webhook;
			}
			if (privchannel) {
				let webhooks = await privchannel
					.fetchWebhooks()
					.catch((e) => {});
				if (!webhooks) return;
				let webhook = webhooks.first();
				if (!webhook) {
					// @ts-ignore
					webhook = await privchannel
						.createWebhook('csr', this.client.user.displayAvatarURL)
						// @ts-ignore
						.catch((e) => {});
				}
				webhooksObj.private = webhook;
			}

			this.container.set(gid, webhooksObj);
		});
	}
	get(guild) {
		const gid = guild.id;
		return this.container.get(gid);
	}
	/**
	 *
	 * @param {Guild} guild
	 * @param {GuildWebhooks|{public:Webhook,private:Webhook}} webhooks
	 */
	set(guild, webhooks) {
		const gid = guild.id;
		let wbs = this.container.get(gid);
		wbs.public ? (wbs.public = webhooks.public) : '';
		wbs.private ? (wbs.private = private) : '';
		this.container.set(gid, webhooks);
	}
	delete(guild) {
		const gid = guild.id;
		this.container.delete(gid);
	}
}
/**
 * @typedef GuildWebhooks
 * @property {Webhook} public
 * @property {Webhook} private
 */
module.exports = WebhookStore;
