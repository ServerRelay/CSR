const { Webhook } = require('discord.js');
const Base = require('./BaseStore');
class WebhookStore extends Base {
	constructor(path) {
		super(path);
		/**
		 * @type {Map<string,GuildWebhooks>}
		 */
		this.container = new Map();
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
