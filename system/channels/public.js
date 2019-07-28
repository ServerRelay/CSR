const Base = require('./base');
const { TextChannel } = require('discord.js');
class PublicChannel extends Base {
	/**
	 *
	 * @param {TextChannel} channel
	 * @param {import('../main')} system
	 */
	constructor(system, channel) {
		super(system, channel);
		this.csrType = 'public';
		/**
		 * @type {import('discord.js').Collection<string,import('discord.js').Message>}
		 */
		// @ts-ignore
		this.messages = channel.messages;
	}
}

module.exports = PublicChannel;
