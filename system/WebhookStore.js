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
	add(guild, webhooks) {
        const gid = guild.id;
		this.container.set(gid, webhooks);
	}
	delete(guild) {
		this.container.delete(id);
	}
}
/**
 * @typedef GuildWebhooks
 * @property {Webhook} public
 * @property {Webhook} private
 */
module.exports = WebhookStore;
