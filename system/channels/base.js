const { TextChannel } = require('discord.js');
class BaseChannel extends TextChannel {
	/**
	 *
	 * @param {TextChannel} channel
	 * @param {import('../main')} system
	 */
	constructor(system,channel) {
		super(channel.guild, channel);
		// @ts-ignore
		this.system = system;
	}
}
module.exports = BaseChannel;
