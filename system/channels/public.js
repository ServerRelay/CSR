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
	}
}

module.exports = PublicChannel;
